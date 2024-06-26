import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { UserDB } from 'hero24-types';

import { paginate, preparePaginatedResult } from '../common/common.utils';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseTableReference } from '../firebase/firebase.types';

import { UserCreationArgs } from './dto/creation/user-creation.args';
import { UserDataInput } from './dto/creation/user-data.input';
import { UserAdminStatusEditInput } from './dto/editAdminStatus/user-admin-status-edit-input';
import { PartialUserDataInput } from './dto/editing/partial-user-data.input';
import { UserDataEditingArgs } from './dto/editing/user-data-editing.args';
import { UserCreatedDto } from './dto/subscriptions/user-created.dto';
import { UserUpdatedDto } from './dto/subscriptions/user-updated.dto';
import { UserDto } from './dto/user/user.dto';
import { UserListDto } from './dto/users/user-list.dto';
import { UsersArgs } from './dto/users/users.args';
import { UserMirror } from './user.mirror';
import {
  SetHasProfileArguments,
  SetNetvisorSellerIdArguments,
} from './user.types';
import { emitUserCreated } from './user.utils/emit-user-created.util';
import { emitUserUpdated } from './user.utils/emit-user-updated.util';

import { FirebaseReference } from '$/modules/firebase/firebase.types';
import { PUBSUB_PROVIDER } from '$modules/graphql-pubsub/graphql-pubsub.constants';

type UserId = string;

@Injectable()
export class UserService {
  private readonly userTableRef: FirebaseTableReference<UserDB>;

  private readonly userAdminTableRef: FirebaseReference<
    Record<UserId, boolean | null>
  >;

  constructor(
    private readonly userMirror: UserMirror,
    private readonly firebaseService: FirebaseService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {
    const database = firebaseService.getDefaultApp().database();

    this.userTableRef = database.ref(FirebaseDatabasePath.USERS);
    this.userAdminTableRef = database.ref(FirebaseDatabasePath.ADMIN_USERS);
  }

  async getUserById(userId: string): Promise<UserDto | null> {
    const userSnapshot = await this.userTableRef.child(userId).get();

    const user = userSnapshot.val();

    return user && UserDto.adapter.toExternal({ id: userId, ...user });
  }

  async strictGetUserById(userId: string): Promise<UserDto> {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new Error(`User with id ${userId} was not found`);
    }

    return user;
  }

  async getAllUsers(): Promise<UserDto[]> {
    return this.userMirror
      .getAll()
      .map(([id, user]) => UserDto.adapter.toExternal({ id, ...user }));
  }

  async getUsers(args: UsersArgs): Promise<UserListDto> {
    const { limit, offset, search } = args;

    let nodes = await this.getAllUsers();

    if (search) {
      const searchText = search.toLowerCase();

      nodes = nodes.filter((user) => {
        const { email, firstName, name, lastName } = user.data;

        const target = [
          email ?? '',
          firstName ?? '',
          name ?? '',
          lastName ?? '',
        ] // TODO: write name as "" in database for deleted records
          .map((str) => str.toLowerCase())
          .join(' ');

        return target.includes(searchText);
      });
    }

    const total = nodes.length;

    nodes = paginate({ nodes, limit, offset });

    return preparePaginatedResult({
      nodes,
      total,
      offset,
      limit,
    });
  }

  async createUser(args: UserCreationArgs): Promise<UserDto> {
    const { data, isCreatedFromWeb, userId } = args;

    let updatedUserId = userId || null;

    const newUserData: UserDB['data'] = {
      ...UserDataInput.adapter.toInternal(data),
      createdAt: Date.now(),
    };

    if (isCreatedFromWeb && userId) {
      // admin
      await this.userTableRef.child(userId).set({
        data: newUserData,
        isCreatedFromWeb,
      });
    } else if (isCreatedFromWeb) {
      // admin
      const newUserRef = await this.userTableRef.push({
        data: newUserData,
        isCreatedFromWeb,
      });

      updatedUserId = newUserRef.key;
    } else if (userId) {
      // user
      await this.userTableRef.child(userId).child('data').set(newUserData);
    }

    if (!updatedUserId) {
      throw new Error("The user can't be created");
    }

    return this.getUserById(updatedUserId) as Promise<UserDto>;
  }

  async editUserData(args: UserDataEditingArgs): Promise<UserDto> {
    const { userId } = args;

    const updatedUserData: Omit<Partial<UserDB['data']>, 'createdAt'> = {
      ...PartialUserDataInput.adapter.toInternal(args.data),
      updatedAt: Date.now(),
    };

    await this.userTableRef.child(userId).child('data').update(updatedUserData);

    return this.getUserById(userId) as Promise<UserDto>;
  }

  async editUserAdminStatus(args: UserAdminStatusEditInput): Promise<UserDto> {
    const { id, isAdmin } = args;

    await this.userTableRef.child(id).update({ isAdmin });
    await this.userAdminTableRef.child(id).set(isAdmin || null);

    return this.strictGetUserById(id);
  }

  async unbindUserOfferRequests(
    userId: string,
    offerRequestIds: string[],
  ): Promise<boolean> {
    offerRequestIds.forEach(async (id) => {
      await this.userTableRef
        .child(userId)
        .child('offerRequests')
        .child(id)
        .remove();
    });

    return true;
  }

  async getUserPhone(userId: string): Promise<string> {
    const phoneSnapshot = await this.userTableRef
      .child(userId)
      .child('data')
      .child('phone')
      .get();

    const phoneNumber: string = phoneSnapshot.val() ?? '';

    return phoneNumber;
  }

  async setHubSpotContactId(
    userId: string,
    hubSpotContactId: string,
  ): Promise<void> {
    await this.userTableRef
      .child(userId)
      .child('hubSpotContactId')
      .set(hubSpotContactId);
  }

  async getUserByIds(userIds: readonly string[]): Promise<(UserDto | null)[]> {
    const users = await this.getAllUsers();

    const userById = new Map(users.map((user) => [user.id, user]));

    return userIds.map((userId) => userById.get(userId) ?? null);
  }

  async createAdmin(input: UserDataInput): Promise<UserDto> {
    const auth = this.firebaseService.getDefaultApp().auth();
    const { uid: userId } = await auth.createUser({ email: input.email });

    const newUser = await this.createUser({
      data: input,
      isCreatedFromWeb: true,
      userId,
    });

    await this.editUserAdminStatus({ id: userId, isAdmin: true });

    return newUser;
  }

  async setHasBuyerProfile(args: SetHasProfileArguments): Promise<void> {
    const { id, hasProfile } = args;

    await this.userTableRef.child(id).child('hasBuyerProfile').set(hasProfile);
  }

  async setHasSellerProfile(args: SetHasProfileArguments): Promise<void> {
    const { id, hasProfile } = args;

    await this.userTableRef.child(id).child('hasSellerProfile').set(hasProfile);
  }

  async setNetvisorSellerId(args: SetNetvisorSellerIdArguments): Promise<void> {
    const { userId, netvisorSellerId } = args;

    await this.userTableRef
      .child(userId)
      .child('netvisorSellerId')
      .set(netvisorSellerId);
  }

  emitUserUpdated(userChanges: UserUpdatedDto): void {
    emitUserUpdated<UserUpdatedDto>(this.pubSub, userChanges);
  }

  emitUserCreated(user: UserCreatedDto): void {
    emitUserCreated<UserCreatedDto>(this.pubSub, user);
  }
}

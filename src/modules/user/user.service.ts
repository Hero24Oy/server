import { Inject, Injectable } from '@nestjs/common';
import { get, getDatabase, ref, update } from 'firebase/database';
import { PubSub } from 'graphql-subscriptions';
import { UserDB } from 'hero24-types';

import { TypeSafeRequired } from '../common/common.types';
import { paginate, preparePaginatedResult } from '../common/common.utils';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';

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
import { emitUserCreated } from './user.utils/emit-user-created.util';
import { emitUserUpdated } from './user.utils/emit-user-updated.util';

@Injectable()
export class UserService {
  constructor(
    private readonly firebaseService: FirebaseService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  async getUserById(userId: string): Promise<UserDto | null> {
    const database = this.firebaseService.getDefaultApp().database();

    const userSnapshot = await database
      .ref(FirebaseDatabasePath.USERS)
      .child(userId)
      .get();

    const user: UserDB | null = userSnapshot.val();

    return user && UserDto.adapter.toExternal({ id: userId, ...user });
  }

  async strictGetUserById(userId: string): Promise<UserDto> {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new Error(`User with id ${userId} was not found`);
    }

    return user;
  }

  async getAllUsers(): Promise<TypeSafeRequired<UserDto>[]> {
    const database = this.firebaseService.getDefaultApp().database();
    const usersRef = database.ref(FirebaseDatabasePath.USERS);

    const usersSnapshot = await usersRef.get();
    const usersTable: Record<string, UserDB> = usersSnapshot.val() || {};

    return Object.entries(usersTable).map(([id, user]) =>
      UserDto.adapter.toExternal({ id, ...user }),
    );
  }

  async getUsers(
    args: UsersArgs,
    app: FirebaseAppInstance,
  ): Promise<UserListDto> {
    const { limit, offset, search } = args;
    const database = getDatabase(app);

    const usersSnapshot = await get(ref(database, FirebaseDatabasePath.USERS));

    const users = Object.entries(
      (usersSnapshot.val() as Record<string, UserDB>) || {},
    ).map(([id, user]) => UserDto.adapter.toExternal({ id, ...user }));

    let nodes = users;

    if (search) {
      const searchText = search.toLowerCase();

      nodes = nodes.filter((user) => {
        const { email, firstName, name, lastName } = user.data;

        const target = [email, firstName || '', name || '', lastName || ''] // TODO: write name as "" in database for deleted records
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

    const database = this.firebaseService.getDefaultApp().database();

    let updatedUserId = userId || null;

    const newUserData: UserDB['data'] = {
      ...UserDataInput.adapter.toInternal(data),
      createdAt: Date.now(),
    };

    if (isCreatedFromWeb && userId) {
      // admin
      await database.ref(FirebaseDatabasePath.USERS).child(userId).set({
        data: newUserData,
        isCreatedFromWeb,
      });
    } else if (isCreatedFromWeb) {
      // admin
      const newUserRef = await database.ref(FirebaseDatabasePath.USERS).push({
        data: newUserData,
        isCreatedFromWeb,
      });

      updatedUserId = newUserRef.key;
    } else if (userId) {
      // user
      await database
        .ref(FirebaseDatabasePath.USERS)
        .child(userId)
        .child('data')
        .set(newUserData);
    }

    if (!updatedUserId) {
      throw new Error("The user can't be created");
    }

    return this.getUserById(updatedUserId) as Promise<UserDto>;
  }

  async editUserData(
    args: UserDataEditingArgs,
    app: FirebaseAppInstance,
  ): Promise<UserDto> {
    const { userId } = args;
    const database = getDatabase(app);

    const updatedUserData: Omit<Partial<UserDB['data']>, 'createdAt'> = {
      ...PartialUserDataInput.adapter.toInternal(args.data),
      updatedAt: Date.now(),
    };

    await update(
      ref(database, `${FirebaseDatabasePath.USERS}/${userId}/data`),
      updatedUserData,
    );

    return this.getUserById(userId) as Promise<UserDto>;
  }

  async editUserAdminStatus(args: UserAdminStatusEditInput): Promise<UserDto> {
    const { id, isAdmin } = args;

    const database = this.firebaseService.getDefaultApp().database();

    await database
      .ref(FirebaseDatabasePath.USERS)
      .child(id)
      .update({ isAdmin });

    const adminUsersRef = database
      .ref(FirebaseDatabasePath.ADMIN_USERS)
      .child(id);

    await adminUsersRef.set(isAdmin || null);

    return this.strictGetUserById(id);
  }

  async unbindUserOfferRequests(
    userId: string,
    offerRequestIds: string[],
    app: FirebaseAppInstance,
  ): Promise<boolean> {
    const offerRequestsData = Object.fromEntries(
      offerRequestIds.map((id) => [id, null]),
    );

    const database = getDatabase(app);

    await update(
      ref(database, `${FirebaseDatabasePath.USERS}/${userId}/offerRequests`),
      offerRequestsData,
    );

    return true;
  }

  async getUserPhone(
    userId: string,
    app: FirebaseAppInstance,
  ): Promise<string> {
    const database = getDatabase(app);
    const path = [FirebaseDatabasePath.USERS, userId, 'data', 'phone'];

    const phoneSnapshot = await get(ref(database, path.join('/')));

    return (phoneSnapshot.val() as string) || '';
  }

  async setHubSpotContactId(
    userId: string,
    hubSpotContactId?: string,
  ): Promise<void> {
    const database = this.firebaseService.getDefaultApp().database();

    await database
      .ref(FirebaseDatabasePath.USERS)
      .child(userId)
      .child('hubSpotContactId')
      .set(hubSpotContactId || null);
  }

  async getUserByIds(userIds: readonly string[]): Promise<(UserDto | null)[]> {
    const users = await this.getAllUsers();

    const userById = new Map(users.map((user) => [user.id, user]));

    return userIds.map((userId) => userById.get(userId) || null);
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

  emitUserUpdated(userChanges: UserUpdatedDto): void {
    emitUserUpdated<UserUpdatedDto>(this.pubSub, userChanges);
  }

  emitUserCreated(user: UserCreatedDto): void {
    emitUserCreated<UserCreatedDto>(this.pubSub, user);
  }
}

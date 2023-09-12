import { Injectable } from '@nestjs/common';
import { Database } from 'firebase-admin/database';
import { UserDB } from 'hero24-types';

import { paginate, preparePaginatedResult } from '../common/common.utils';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';

import { UserCreationArgs } from './dto/creation/user-creation.args';
import { UserDataInput } from './dto/creation/user-data.input';
import { PartialUserDataInput } from './dto/editing/partial-user-data.input';
import { UserDataEditingArgs } from './dto/editing/user-data-editing.args';
import { UserDto } from './dto/user/user.dto';
import { UserListDto } from './dto/users/user-list.dto';
import { UsersArgs } from './dto/users/users.args';
import { UserDbWithPartialData } from './user.types';

@Injectable()
export class UserService {
  database: Database;

  constructor(private readonly firebaseService: FirebaseService) {
    this.database = this.firebaseService.getDefaultApp().database();
  }

  async getUserById(userId: string): Promise<UserDto | null> {
    const userSnapshot = await this.database
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

  async getAllUsers() {
    const usersRef = this.database.ref(FirebaseDatabasePath.USERS);

    const usersSnapshot = await usersRef.get();
    const usersTable: Record<string, UserDB> = usersSnapshot.val() || {};

    return Object.entries(usersTable).map(([id, user]) =>
      UserDto.adapter.toExternal({ id, ...user }),
    );
  }

  async getUsers(args: UsersArgs): Promise<UserListDto> {
    const { limit, offset, search } = args;

    const usersSnapshot = await this.database
      .ref(FirebaseDatabasePath.USERS)
      .get();

    const users = Object.entries(
      (usersSnapshot.val() as Record<string, UserDB>) || {},
    ).map(([id, user]) => UserDto.adapter.toExternal({ id, ...user }));

    let nodes = users;

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

    let updatedUserId = userId ?? null;

    const newUserData: UserDbWithPartialData['data'] = {
      ...UserDataInput.adapter.toInternal(data),
      createdAt: Date.now(),
    };

    if (isCreatedFromWeb && userId) {
      // admin
      await this.database.ref(FirebaseDatabasePath.USERS).child(userId).set({
        data: newUserData,
        isCreatedFromWeb,
      });
    } else if (isCreatedFromWeb) {
      // admin
      const newUserRef = await this.database
        .ref(FirebaseDatabasePath.USERS)
        .push({
          data: newUserData,
          isCreatedFromWeb,
        });

      updatedUserId = newUserRef.key;
    } else if (userId) {
      // user

      await this.database
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

  async editUserData(args: UserDataEditingArgs): Promise<UserDto> {
    const { userId } = args;

    const updatedUserData: Omit<Partial<UserDB['data']>, 'createdAt'> = {
      ...PartialUserDataInput.adapter.toInternal(args.data),
      updatedAt: Date.now(),
    };

    await this.database
      .ref(FirebaseDatabasePath.USERS)
      .child(userId)
      .child('data')
      .update(updatedUserData);

    return this.getUserById(userId) as Promise<UserDto>;
  }

  async unbindUserOfferRequests(
    userId: string,
    offerRequestIds: string[],
  ): Promise<boolean> {
    const offerRequestsData = Object.fromEntries(
      offerRequestIds.map((id) => [id, null]),
    );

    await this.database
      .ref(FirebaseDatabasePath.USERS)
      .child(userId)
      .child('offerRequests')
      .update(offerRequestsData);

    return true;
  }

  async getUserPhone(userId: string): Promise<string> {
    const phoneSnapshot = await this.database
      .ref(FirebaseDatabasePath.USERS)
      .child(userId)
      .child('data')
      .child('phone')
      .get();

    return phoneSnapshot.val() ?? '';
  }

  async setHubSpotContactId(userId: string, hubSpotContactId?: string) {
    await this.database
      .ref(FirebaseDatabasePath.USERS)
      .child(userId)
      .child('hubSpotContactId')
      .set(hubSpotContactId ?? null);
  }

  async getUserByIds(userIds: readonly string[]): Promise<(UserDto | null)[]> {
    const users = await this.getAllUsers();

    const userById = new Map(users.map((user) => [user.id, user]));

    return userIds.map((userId) => userById.get(userId) ?? null);
  }
}

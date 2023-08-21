import { Injectable } from '@nestjs/common';
import { UserDB } from 'hero24-types';

import { ref, getDatabase, get, set, push, update } from 'firebase/database';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { UserDto } from './dto/user/user.dto';
import { UserListDto } from './dto/users/user-list.dto';
import { UsersArgs } from './dto/users/users.args';
import { UserCreationArgs } from './dto/creation/user-creation.args';
import { UserDataEditingArgs } from './dto/editing/user-data-editing.args';
import { UserDataInput } from './dto/creation/user-data.input';
import { PartialUserDataInput } from './dto/editing/partial-user-data.input';
import { FirebaseService } from '../firebase/firebase.service';
import { paginate, preparePaginatedResult } from '../common/common.utils';

@Injectable()
export class UserService {
  constructor(private firebaseService: FirebaseService) {}

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

  async getAllUsers() {
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

  async createUser(
    args: UserCreationArgs,
    app: FirebaseAppInstance,
  ): Promise<UserDto> {
    const { data, isCreatedFromWeb, userId } = args;

    const database = getDatabase(app);

    let updatedUserId = userId || null;

    const newUserData: UserDB['data'] = {
      ...UserDataInput.adapter.toInternal(data),
      createdAt: Date.now(),
    };

    if (isCreatedFromWeb && userId) {
      // admin
      await set(ref(database, `${FirebaseDatabasePath.USERS}/${userId}`), {
        data: newUserData,
        isCreatedFromWeb,
      });
    } else if (isCreatedFromWeb) {
      // admin
      const newUserRef = await push(
        ref(database, `${FirebaseDatabasePath.USERS}`),
        {
          data: newUserData,
          isCreatedFromWeb,
        },
      );
      updatedUserId = newUserRef.key;
    } else if (userId) {
      // user
      await set(
        ref(database, `${FirebaseDatabasePath.USERS}/${userId}/data`),
        newUserData,
      );
    }

    if (!updatedUserId) {
      throw new Error(`The user can't be created`);
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

    return phoneSnapshot.val() || '';
  }

  async setHubSpotContactId(userId: string, hubSpotContactId?: string) {
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
}

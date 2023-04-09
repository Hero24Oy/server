import { Injectable } from '@nestjs/common';
import { UserDB } from 'hero24-types';

import {
  ref,
  getDatabase,
  get,
  set,
  push,
  update,
  serverTimestamp,
} from 'firebase/database';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { UserDto } from './dto/user/user.dto';
import { UsersDto } from './dto/users/users.dto';
import { UsersArgs } from './dto/users/users.args';
import { UserCreationArgs } from './dto/creation/user-creation.args';
import { UserDataEditingArgs } from './dto/editing/user-data-editing.args';

@Injectable()
export class UserService {
  async getUserById(
    userId: string,
    app: FirebaseAppInstance,
  ): Promise<UserDto | null> {
    const database = getDatabase(app);

    const userSnapshot = await get(
      ref(database, `${FirebaseDatabasePath.USERS}/${userId}`),
    );

    const user: UserDB | null = userSnapshot.val();

    return user && UserDto.convertFromFirebaseType(userId, user);
  }

  async getUsers(args: UsersArgs, app: FirebaseAppInstance): Promise<UsersDto> {
    const { limit, offset, search } = args;
    const database = getDatabase(app);

    const usersSnapshot = await get(ref(database, FirebaseDatabasePath.USERS));

    if (!usersSnapshot.exists()) {
      return {
        edges: [],
        endCursor: null,
        hasNextPage: false,
        total: 0,
      };
    }

    let users = Object.entries(
      (usersSnapshot.val() as Record<string, UserDB>) || {},
    ).map(([id, user]) => UserDto.convertFromFirebaseType(id, user));

    const isPaginationEnabled =
      typeof limit === 'number' && typeof offset === 'number';

    if (search) {
      const searchText = search.toLowerCase();

      users = users.filter((user) => {
        const { email, firstName = '', name, lastName = '' } = user.data;

        const target = [email, firstName, name, lastName]
          .map((str) => str.toLowerCase())
          .join(' ');

        return target.includes(searchText);
      });
    }

    const total = users.length;
    const hasNextPage = isPaginationEnabled ? total > offset + limit : false;

    if (isPaginationEnabled) {
      users = users.slice(offset, offset + limit);
    }

    return {
      edges: users.map((node) => ({ node, cursor: node.id })),
      endCursor: users[users.length - 1]?.id || null,
      hasNextPage,
      total,
    };
  }

  async createUser(
    args: UserCreationArgs,
    app: FirebaseAppInstance,
  ): Promise<UserDto> {
    const { data, isCreatedFromWeb, userId } = args;

    const database = getDatabase(app);

    let updatedUserId = userId || null;

    const newUserData = {
      ...data,
      createdAt: serverTimestamp() as unknown as number,
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

    return this.getUserById(updatedUserId, app) as Promise<UserDto>;
  }

  async editUserData(
    args: UserDataEditingArgs,
    app: FirebaseAppInstance,
  ): Promise<UserDto> {
    const { userId } = args;
    const database = getDatabase(app);

    await update(
      ref(database, `${FirebaseDatabasePath.USERS}/${userId}/data`),
      {
        ...args.data,
        // 'updatedAt' field fixes an issue where login(UserA)->logout->login(UserA) wouldn't reload the user
        updatedAt: serverTimestamp() as unknown as number,
      },
    );

    return this.getUserById(userId, app) as Promise<UserDto>;
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
}

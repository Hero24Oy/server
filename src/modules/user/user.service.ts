import { Injectable } from '@nestjs/common';
import { UserDB } from 'hero24-types';
import * as admin from 'firebase-admin';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { UserDto } from './dto/user/user.dto';
import { UsersDto } from './dto/users/users.dto';
import { UsersArgs } from './dto/users/users.args';
import { UserCreationArgs } from './dto/creation/user-creation.args';

@Injectable()
export class UserService {
  async getUserById(
    userId: string,
    app: FirebaseAppInstance,
  ): Promise<UserDto | null> {
    const userSnapshot = await app
      .database()
      .ref(FirebaseDatabasePath.USERS)
      .child(userId)
      .once('value');

    const user: UserDB | null = userSnapshot.val();

    return user && UserDto.convertFromFirebaseType(userId, user);
  }

  async getUsers(args: UsersArgs, app: FirebaseAppInstance): Promise<UsersDto> {
    const { limit, offset, search } = args;
    const usersSnapshot: admin.database.DataSnapshot = await app
      .database()
      .ref(FirebaseDatabasePath.USERS)
      .once('value');

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
    const { data, isCreatedFromWeb } = args;

    const newUserRef = await app
      .database()
      .ref(FirebaseDatabasePath.USERS)
      .push({
        isCreatedFromWeb,
        data,
        createdAt: admin.database.ServerValue.TIMESTAMP as number,
      });

    if (!newUserRef.key) {
      throw new Error(`The user can't be created`);
    }

    return this.getUserById(newUserRef.key, app) as Promise<UserDto>;
  }
}

import { Inject, Injectable } from '@nestjs/common';

import { ref, getDatabase, get, set, serverTimestamp } from 'firebase/database';
import { getDatabase as getAdminDatabase } from 'firebase-admin/database';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { UserMergeDto } from './dto/user-merge/user-merge.dto';
import { UserMergeDB } from 'hero24-types';
import { UserMergeInput } from './dto/user-merge/user-merge.input';
import { FirebaseService } from '../firebase/firebase.service';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class UserMergeService {
  constructor(
    private firebaseService: FirebaseService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  async getUserMergeByUserId(userId: string): Promise<UserMergeDto | null> {
    const database = getAdminDatabase(this.firebaseService.getDefaultApp());

    const userMergeSnapshot = await database
      .ref(`${FirebaseDatabasePath.USER_MERGES}/${userId}`)
      .once('value');

    const userMerge: UserMergeDto | null = userMergeSnapshot.val();

    return userMerge && userMerge;
  }

  async startUserMerge(
    userMergeInput: UserMergeInput,
    app: FirebaseAppInstance,
  ): Promise<UserMergeDto | null> {
    const database = getDatabase(app);
    if (!userMergeInput.userId) {
      return null;
    }
    await set(
      ref(
        database,
        `${FirebaseDatabasePath.USER_MERGES}/${userMergeInput.userId}`,
      ),
      userMergeInput,
    );

    const userMerge = await this.getUserMergeByUserId(userMergeInput.userId);

    return userMerge;
  }
}

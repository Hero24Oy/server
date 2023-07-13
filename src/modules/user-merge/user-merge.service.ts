import { Inject, Injectable } from '@nestjs/common';

import { serverTimestamp } from 'firebase/database';
import { getDatabase as getAdminDatabase } from 'firebase-admin/database';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { UserMergeDto } from './dto/user-merge/user-merge.dto';
import { UserMergeInput } from './dto/user-merge/user-merge.input';
import { FirebaseService } from '../firebase/firebase.service';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { PubSub } from 'graphql-subscriptions';
import { UserMergeDB } from 'hero24-types';
import { Identity } from '../auth/auth.types';

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

    const userMerge: UserMergeDB | null = userMergeSnapshot.val();

    return userMerge && UserMergeDto.convertFromFirebaseType(userMerge);
  }

  async startUserMerge(
    userMergeInput: UserMergeInput,
    identity: Identity,
  ): Promise<UserMergeInput> {
    const database = getAdminDatabase(this.firebaseService.getDefaultApp());

    let newUserMerge: Omit<UserMergeDB, 'createdAt'> =
      UserMergeDto.convertToFirebaseType({
        ...userMergeInput,
        userId: identity.id
      });

    await database
      .ref(`${FirebaseDatabasePath.USER_MERGES}/${userMergeInput.userId}`)
      .set({
        ...newUserMerge,
        createdAt: serverTimestamp(),
      });

    return userMergeInput;
  }
}

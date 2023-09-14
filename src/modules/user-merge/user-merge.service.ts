import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { UserMergeDB } from 'hero24-types';

import { Identity } from '../auth/auth.types';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';

import { UserMergeDto } from './dto/user-merge/user-merge.dto';
import { UserMergeInput } from './dto/user-merge/user-merge.input';

@Injectable()
export class UserMergeService {
  constructor(
    private firebaseService: FirebaseService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  async getUserMergeByUserId(userId: string): Promise<UserMergeDto | null> {
    const database = this.firebaseService.getDefaultApp().database();

    const userMergeSnapshot = await database
      .ref(FirebaseDatabasePath.USER_MERGES)
      .child(userId)
      .once('value');

    const userMerge: UserMergeDB | null = userMergeSnapshot.val();

    return userMerge && UserMergeDto.adapter.toExternal(userMerge);
  }

  async strictGetUserMergeByUserId(userId: string): Promise<UserMergeDto> {
    const userMerge = await this.getUserMergeByUserId(userId);

    if (!userMerge) {
      throw new Error('User merge was not found');
    }

    return userMerge;
  }

  async startUserMerge(
    userMergeInput: UserMergeInput,
    identity: Identity,
  ): Promise<UserMergeDto> {
    const database = this.firebaseService.getDefaultApp().database();

    const newUserMerge = UserMergeInput.adapter.toInternal({
      ...userMergeInput,
      userId: identity.id,
    });

    await database
      .ref(FirebaseDatabasePath.USER_MERGES)
      .child(identity.id)
      .set(newUserMerge);

    return this.strictGetUserMergeByUserId(identity.id);
  }
}

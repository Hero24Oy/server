import { Injectable } from '@nestjs/common';
import { UserMergeDB } from 'hero24-types';

import { Identity } from '../auth/auth.types';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseTableReference } from '../firebase/firebase.types';

import { UserMergeDto } from './dto/user-merge/user-merge.dto';
import { UserMergeInput } from './dto/user-merge/user-merge.input';

@Injectable()
export class UserMergeService {
  private userMergeTableRef: FirebaseTableReference<UserMergeDB>;

  constructor(firebaseService: FirebaseService) {
    const database = firebaseService.getDefaultApp().database();

    this.userMergeTableRef = database.ref(FirebaseDatabasePath.USER_MERGES);
  }

  async getUserMergeByUserId(userId: string): Promise<UserMergeDto | null> {
    const userMergeSnapshot = await this.userMergeTableRef.child(userId).get();

    const userMerge = userMergeSnapshot.val();

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
    const newUserMerge = UserMergeInput.adapter.toInternal({
      ...userMergeInput,
      userId: identity.id,
    });

    await this.userMergeTableRef.child(identity.id).set(newUserMerge);

    return this.strictGetUserMergeByUserId(identity.id);
  }
}

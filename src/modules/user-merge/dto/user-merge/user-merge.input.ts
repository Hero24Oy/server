import { InputType, OmitType } from '@nestjs/graphql';
import { UserMergeDB } from 'hero24-types';

import { UserMergeDto } from './user-merge.dto';

import { omit } from '$imports/lodash';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

const omittedFields = ['createdAt'] as const;

@InputType()
export class UserMergeInput extends OmitType(
  UserMergeDto,
  omittedFields,
  InputType,
) {
  static adapter: FirebaseAdapter<UserMergeDB, UserMergeInput>;
}

UserMergeInput.adapter = new FirebaseAdapter({
  toExternal: (internal) =>
    omit(UserMergeDto.adapter.toExternal(internal), 'createdAt'),
  toInternal: (external) =>
    UserMergeDto.adapter.toInternal({
      ...external,
      createdAt: new Date(),
    }),
});

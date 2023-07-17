import { InputType, OmitType } from '@nestjs/graphql';
import { UserMergeDto } from './user-merge.dto';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';
import { UserMergeDB } from 'hero24-types';
import { omit } from 'lodash';

const OMITTED_FIELDS = ['createdAt'] as const;

@InputType()
export class UserMergeInput extends OmitType(
  UserMergeDto,
  OMITTED_FIELDS,
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

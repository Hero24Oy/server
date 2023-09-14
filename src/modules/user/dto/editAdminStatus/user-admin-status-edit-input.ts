import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { UserDB } from 'hero24-types';

import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

import { UserDto } from '../user/user.dto';

const PICKED_FIELDS = ['isAdmin'] as const;

@InputType()
export class UserAdminStatusEditInput extends PartialType(
  PickType(UserDto, PICKED_FIELDS, InputType),
) {
  static adapter: FirebaseAdapter<
    Pick<UserDB, keyof UserAdminStatusEditInput>,
    UserAdminStatusEditInput
  >;
}

UserAdminStatusEditInput.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    isAdmin: internal.isAdmin,
  }),
  toInternal: (external) => ({
    isAdmin: external.isAdmin ?? false,
  }),
});

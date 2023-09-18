import { Field, InputType } from '@nestjs/graphql';

import { UserDto } from '../user/user.dto';

import { FirebaseAdapter } from '$/modules/firebase/firebase.adapter';

@InputType()
export class UserAdminStatusEditInput {
  @Field(() => Boolean)
  isAdmin: UserDto['isAdmin'];

  @Field(() => String)
  id: UserDto['id'];

  static adapter: FirebaseAdapter<
    Pick<UserDto, keyof UserAdminStatusEditInput>,
    UserAdminStatusEditInput
  >;
}

UserAdminStatusEditInput.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    id: internal.id,
    isAdmin: internal.isAdmin || false,
  }),
  toInternal: (external) => ({
    id: external.id,
    isAdmin: external.isAdmin ?? false,
  }),
});

import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { UserDB } from 'hero24-types';

import { MaybeType } from '$/src/modules/common/common.types';
import { FirebaseAdapter } from '$/src/modules/firebase/firebase.adapter';

@ObjectType()
@InputType('UserDataActiveRouteInput')
export class UserDataActiveRouteDto {
  @Field(() => String, { nullable: true })
  chatId?: MaybeType<string>;

  static adapter: FirebaseAdapter<
    Exclude<UserDB['data']['activeRoute'], undefined>,
    UserDataActiveRouteDto
  >;
}

UserDataActiveRouteDto.adapter = new FirebaseAdapter({
  toExternal: ({ chatId }) => ({ chatId }),
  toInternal: ({ chatId }) => ({ chatId: chatId ?? undefined }),
});

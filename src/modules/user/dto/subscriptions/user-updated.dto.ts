import { Field, ObjectType } from '@nestjs/graphql';

import { UserDto } from '../user/user.dto';

@ObjectType()
export class UserUpdatedDto {
  @Field(() => UserDto)
  user: UserDto;

  // only for server (n8n module optimization)
  beforeUpdateUser: UserDto;
}

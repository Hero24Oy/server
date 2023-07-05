import { Field, ObjectType } from '@nestjs/graphql';

import { UserDto } from '../user/user.dto';

@ObjectType()
export class UserCreatedDto {
  @Field(() => UserDto)
  user: UserDto;
}

import { ObjectType } from '@nestjs/graphql';

import { UserDto } from '../user/user.dto';

import { Paginated } from '$modules/common/dto/pagination.dto';

@ObjectType()
export class UserListDto extends Paginated(UserDto) {}

import { ObjectType } from '@nestjs/graphql';
import { makePaginationDto } from 'src/modules/common/dto/pagination.dto';
import { UserDto } from '../user/user.dto';

@ObjectType()
export class UsersDto extends makePaginationDto<UserDto, UserDto['id']>(
  'UsersDto',
  UserDto,
  String,
) {}

import { ArgsType, ObjectType } from '@nestjs/graphql';
import {
  makePaginationBaseObject,
  PaginationArgs,
} from 'src/modules/common/graphql-dto/Pagination';
import { UserDto } from './User';

@ObjectType()
export class UsersDto extends makePaginationBaseObject<UserDto, UserDto['id']>(
  'UsersDto',
  UserDto,
  String,
) {}

@ArgsType()
export class UsersArgs extends PaginationArgs {}

import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/modules/common/dto/pagination.dto';

import { UserDto } from '../user/user.dto';

@ObjectType()
export class UserListDto extends Paginated(UserDto) {}

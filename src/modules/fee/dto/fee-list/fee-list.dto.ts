import { ObjectType } from '@nestjs/graphql';

import { FeeDto } from '../fee/fee.dto';

import { Paginated } from '$modules/common/dto/pagination.dto';

@ObjectType()
export class FeeListDto extends Paginated(FeeDto) {}

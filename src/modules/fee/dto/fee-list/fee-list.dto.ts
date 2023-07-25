import { Paginated } from 'src/modules/common/dto/pagination.dto';

import { FeeDto } from '../fee/fee.dto';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FeeListDto extends Paginated(FeeDto) {}

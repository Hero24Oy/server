import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/modules/common/dto/pagination.dto';

import { FeeDto } from '../fee/fee.dto';

@ObjectType()
export class FeeListDto extends Paginated(FeeDto) {}

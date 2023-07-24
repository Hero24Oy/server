import { ArgsType } from '@nestjs/graphql';

import { PaginationArgs } from 'src/modules/common/dto/pagination.args';

@ArgsType()
export class FeeListArgs extends PaginationArgs {}
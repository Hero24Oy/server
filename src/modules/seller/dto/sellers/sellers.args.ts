import { ArgsType } from '@nestjs/graphql';

import { PaginationArgs } from '$modules/common/dto/pagination.args';

@ArgsType()
export class SellersArgs extends PaginationArgs {}

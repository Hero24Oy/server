import { InputType } from '@nestjs/graphql';

import { PaginationArgs } from '$/src/modules/common/dto/pagination.args';

@InputType()
export class OpenOfferRequestListInput extends PaginationArgs {}

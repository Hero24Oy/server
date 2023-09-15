import { InputType } from '@nestjs/graphql';

import { PaginationArgs } from '$modules/common/dto/pagination.args';

@InputType()
export class OpenOfferRequestListInput extends PaginationArgs {}

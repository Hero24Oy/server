import { Field, InputType } from '@nestjs/graphql';

import { OfferRequestOrderColumn } from './offer-request-order-column';

import { SortOrder } from '$/src/modules/common/sort-order/sort-order.enum';

@InputType()
export class OfferRequestOrderInput {
  @Field(() => OfferRequestOrderColumn)
  column: OfferRequestOrderColumn;

  @Field(() => SortOrder)
  order: SortOrder;
}

import { Field, InputType } from '@nestjs/graphql';
import { SortOrder } from 'src/modules/common/sort-order/sort-order.enum';

import { OfferRequestOrderColumn } from './offer-request-order-column';

@InputType()
export class OfferRequestOrderInput {
  @Field(() => OfferRequestOrderColumn)
  column: OfferRequestOrderColumn;

  @Field(() => SortOrder)
  order: SortOrder;
}

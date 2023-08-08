import { Field, InputType } from '@nestjs/graphql';
import { SortOrder } from 'src/modules/common/sort-order/sort-order.enum';
import { OfferOrderColumn } from './offers-order.enum';

@InputType()
export class OffersOrderInput {
  @Field(() => OfferOrderColumn)
  column: OfferOrderColumn;

  @Field(() => SortOrder)
  order: SortOrder;
}

import { Field, InputType, PickType } from '@nestjs/graphql';

import { OfferRequestDataInitialDto } from '../offer-request/offer-request-data-initial.dto';

@InputType()
export class OfferRequestPurchaseInput extends PickType(
  OfferRequestDataInitialDto,
  ['fixedDuration', 'fixedPrice'],
  InputType,
) {
  @Field(() => String)
  id: string;
}

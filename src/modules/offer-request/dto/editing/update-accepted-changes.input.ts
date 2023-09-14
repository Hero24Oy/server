import { Field, InputType } from '@nestjs/graphql';

import { OfferRequestIdInput } from '$modules/offer/dto/editing/offer-request-id.input';

@InputType()
export class UpdateAcceptedChangesInput extends OfferRequestIdInput {
  @Field(() => Boolean)
  detailsChangeAccepted: boolean;

  @Field(() => Boolean)
  timeChangeAccepted: boolean;
}

import { Field, InputType, PickType } from '@nestjs/graphql';

import { OfferRequestDto } from '../offer-request/offer-request.dto';

import { OfferRequestDataInput } from './offer-request-data.input';
import { OfferRequestSubscriptionInput } from './offer-request-subscription.input';

import { MaybeType } from '$modules/common/common.types';

@InputType()
export class OfferRequestCreationInput extends PickType(
  OfferRequestDto,
  ['customerVAT', 'serviceProviderVAT', 'hero24Cut', 'minimumDuration'],
  InputType,
) {
  @Field(() => OfferRequestDataInput)
  data: OfferRequestDataInput;

  @Field(() => OfferRequestSubscriptionInput, { nullable: true })
  subscription?: MaybeType<OfferRequestSubscriptionInput>;
}

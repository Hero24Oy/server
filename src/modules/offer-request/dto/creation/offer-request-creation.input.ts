import { Field, Float, InputType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';

import { OfferRequestDataInput } from './offer-request-data.input';
import { OfferRequestSubscriptionInput } from './offer-request-subscription.input';

@InputType()
export class OfferRequestCreationInput {
  @Field(() => OfferRequestDataInput)
  data: OfferRequestDataInput;

  @Field(() => OfferRequestSubscriptionInput, { nullable: true })
  subscription?: MaybeType<OfferRequestSubscriptionInput>;

  @Field(() => Float, { nullable: true })
  customerVat?: MaybeType<number>;

  @Field(() => Float, { nullable: true })
  minimumDuration?: MaybeType<number>;

  @Field(() => Float, { nullable: true })
  serviceProviderVAT?: MaybeType<number>;
}

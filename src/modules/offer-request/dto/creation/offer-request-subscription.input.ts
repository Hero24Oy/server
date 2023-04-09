import { Field, InputType } from '@nestjs/graphql';
import { SUBSCRIPTION_INTERVAL } from 'hero24-types';

@InputType()
export class OfferRequestSubscriptionInput {
  @Field(() => String)
  subscriptionType: SUBSCRIPTION_INTERVAL;
}

import { Field, InputType, Int } from '@nestjs/graphql';
import { OfferRequestSubscription, SUBSCRIPTION_INTERVAL } from 'hero24-types';

@InputType()
export class OfferRequestSubscriptionInput implements OfferRequestSubscription {
  @Field(() => String)
  subscriptionId: string;

  @Field(() => String)
  subscriptionType: SUBSCRIPTION_INTERVAL;

  @Field(() => Boolean, { nullable: true })
  initialRequest?: boolean;

  @Field(() => Int, { nullable: true })
  priceDiscount?: number;

  @Field(() => String, { nullable: true })
  discountFormat?: 'fixed' | 'percentage';

  @Field(() => Int)
  currentAnchorDate: number;

  @Field(() => Int)
  nextAnchorDate: number;
}

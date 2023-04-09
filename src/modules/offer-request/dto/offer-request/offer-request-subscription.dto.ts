import { Field, Int, ObjectType } from '@nestjs/graphql';
import { OfferRequestSubscription, SUBSCRIPTION_INTERVAL } from 'hero24-types';

@ObjectType()
export class OfferRequestSubscriptionDto {
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
  currentAnchorDate: Date;

  @Field(() => Int)
  nextAnchorDate: Date;

  static convertToFirebaseType(
    data: OfferRequestSubscriptionDto,
  ): OfferRequestSubscription {
    return {
      ...data,
      currentAnchorDate: +new Date(data.currentAnchorDate),
      nextAnchorDate: +new Date(data.nextAnchorDate),
    };
  }

  static convertFromFirebaseType(
    data: OfferRequestSubscription,
  ): OfferRequestSubscriptionDto {
    return {
      ...data,
      currentAnchorDate: new Date(data.currentAnchorDate),
      nextAnchorDate: new Date(data.nextAnchorDate),
    };
  }
}

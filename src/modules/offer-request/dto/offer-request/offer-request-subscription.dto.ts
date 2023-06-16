import { Field, Float, ObjectType } from '@nestjs/graphql';
import { OfferRequestSubscription, SUBSCRIPTION_INTERVAL } from 'hero24-types';

import { omitUndefined } from 'src/modules/common/common.utils';

@ObjectType()
export class OfferRequestSubscriptionDto {
  @Field(() => String)
  subscriptionId: string;

  @Field(() => String)
  subscriptionType: SUBSCRIPTION_INTERVAL;

  @Field(() => Boolean, { nullable: true })
  initialRequest?: boolean;

  @Field(() => Float, { nullable: true })
  priceDiscount?: number;

  @Field(() => String, { nullable: true })
  discountFormat?: 'fixed' | 'percentage';

  @Field(() => Date)
  currentAnchorDate: Date;

  @Field(() => Date)
  nextAnchorDate: Date;

  static convertToFirebaseType(
    data: OfferRequestSubscriptionDto,
  ): OfferRequestSubscription {
    return omitUndefined({
      ...data,
      currentAnchorDate: +new Date(data.currentAnchorDate),
      nextAnchorDate: +new Date(data.nextAnchorDate),
    });
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

import { Field, Float, ObjectType } from '@nestjs/graphql';
import { OfferRequestSubscription, SUBSCRIPTION_INTERVAL } from 'hero24-types';

import { TypeSafeRequired } from 'src/modules/common/common.types';
import { FirebaseGraphQLAdapter } from 'src/modules/firebase/firebase.interfaces';

type OfferRequestSubscriptionShape = {
  subscriptionId: string;
  subscriptionType: SUBSCRIPTION_INTERVAL;
  initialRequest?: boolean;
  priceDiscount?: number;
  discountFormat?: 'fixed' | 'percentage';
  currentAnchorDate: Date;
  nextAnchorDate: Date;
};

@ObjectType()
export class OfferRequestSubscriptionDto extends FirebaseGraphQLAdapter<
  OfferRequestSubscriptionShape,
  OfferRequestSubscription
> {
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

  protected toFirebaseType(): TypeSafeRequired<OfferRequestSubscription> {
    return {
      subscriptionId: this.subscriptionId,
      subscriptionType: this.subscriptionType,
      initialRequest: this.initialRequest,
      priceDiscount: this.priceDiscount,
      discountFormat: this.discountFormat,
      currentAnchorDate: +new Date(this.currentAnchorDate),
      nextAnchorDate: +new Date(this.nextAnchorDate),
    };
  }

  protected fromFirebaseType(
    subscription: OfferRequestSubscription,
  ): TypeSafeRequired<OfferRequestSubscriptionShape> {
    return {
      subscriptionId: subscription.subscriptionId,
      subscriptionType: subscription.subscriptionType,
      initialRequest: subscription.initialRequest,
      priceDiscount: subscription.priceDiscount,
      discountFormat: subscription.discountFormat,
      currentAnchorDate: new Date(subscription.currentAnchorDate),
      nextAnchorDate: new Date(subscription.nextAnchorDate),
    };
  }
}

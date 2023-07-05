import { Field, Float, ObjectType } from '@nestjs/graphql';
import { OfferRequestSubscription, SUBSCRIPTION_INTERVAL } from 'hero24-types';

import { MaybeType, TypeSafeRequired } from 'src/modules/common/common.types';
import { FirebaseGraphQLAdapter } from 'src/modules/firebase/firebase.interfaces';

type OfferRequestSubscriptionShape = {
  subscriptionId: string;
  subscriptionType: SUBSCRIPTION_INTERVAL;
  initialRequest?: MaybeType<boolean>;
  priceDiscount?: MaybeType<number>;
  discountFormat?: MaybeType<'fixed' | 'percentage'>;
  currentAnchorDate: Date;
  nextAnchorDate: Date;
};

@ObjectType()
export class OfferRequestSubscriptionDto
  extends FirebaseGraphQLAdapter<
    OfferRequestSubscriptionShape,
    OfferRequestSubscription
  >
  implements OfferRequestSubscriptionShape
{
  @Field(() => String)
  subscriptionId: string;

  @Field(() => String)
  subscriptionType: SUBSCRIPTION_INTERVAL;

  @Field(() => Boolean, { nullable: true })
  initialRequest?: MaybeType<boolean>;

  @Field(() => Float, { nullable: true })
  priceDiscount?: MaybeType<number>;

  @Field(() => String, { nullable: true })
  discountFormat?: MaybeType<'fixed' | 'percentage'>;

  @Field(() => Date)
  currentAnchorDate: Date;

  @Field(() => Date)
  nextAnchorDate: Date;

  protected toFirebaseType(): TypeSafeRequired<OfferRequestSubscription> {
    return {
      subscriptionId: this.subscriptionId,
      subscriptionType: this.subscriptionType,
      initialRequest: this.initialRequest ?? undefined,
      priceDiscount: this.priceDiscount ?? undefined,
      discountFormat: this.discountFormat ?? undefined,
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

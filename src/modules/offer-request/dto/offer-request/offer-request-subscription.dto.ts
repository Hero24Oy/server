import { Field, Float, ObjectType } from '@nestjs/graphql';
import { OfferRequestSubscription, SUBSCRIPTION_INTERVAL } from 'hero24-types';

import { MaybeType } from 'src/modules/common/common.types';
import { FirebaseAdapter } from 'src/modules/firebase/firebase-adapter.interfaces';

@ObjectType()
export class OfferRequestSubscriptionDto {
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

  static adapter: FirebaseAdapter<
    OfferRequestSubscription,
    OfferRequestSubscriptionDto
  >;
}

OfferRequestSubscriptionDto.adapter = new FirebaseAdapter({
  toInternal(external) {
    return {
      subscriptionId: external.subscriptionId,
      subscriptionType: external.subscriptionType,
      initialRequest: external.initialRequest ?? undefined,
      priceDiscount: external.priceDiscount ?? undefined,
      discountFormat: external.discountFormat ?? undefined,
      currentAnchorDate: +new Date(external.currentAnchorDate),
      nextAnchorDate: +new Date(external.nextAnchorDate),
    };
  },
  toExternal(internal) {
    return {
      subscriptionId: internal.subscriptionId,
      subscriptionType: internal.subscriptionType,
      initialRequest: internal.initialRequest,
      priceDiscount: internal.priceDiscount,
      discountFormat: internal.discountFormat,
      currentAnchorDate: new Date(internal.currentAnchorDate),
      nextAnchorDate: new Date(internal.nextAnchorDate),
    };
  },
});

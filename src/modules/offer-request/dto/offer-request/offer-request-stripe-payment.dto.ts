import { Field, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB, STRIPE_PAYMENT_STATUS } from 'hero24-types';

import { MaybeType } from '$modules/common/common.types';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

type StripePaymentDB = Exclude<OfferRequestDB['stripePayment'], undefined>;

@ObjectType()
export class OfferRequestStripePaymentDto {
  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String, { nullable: true })
  link?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  message?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  status?: STRIPE_PAYMENT_STATUS;

  static adapter: FirebaseAdapter<
    StripePaymentDB,
    OfferRequestStripePaymentDto
  >;
}

OfferRequestStripePaymentDto.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    link: external.link ?? undefined,
    message: external.message ?? undefined,
    status: external.status ?? undefined,
    updatedAt: Number(external.updatedAt),
  }),
  toExternal: (internal) => ({
    link: internal.link,
    message: internal.message,
    status: internal.status,
    updatedAt: new Date(internal.updatedAt),
  }),
});

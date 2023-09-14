import { Field, Float, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB, REFUND_STATUS } from 'hero24-types';

import { MaybeType } from '$modules/common/common.types';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

type RefundDB = Exclude<OfferRequestDB['refund'], undefined>;

@ObjectType()
export class OfferRequestRefundDto {
  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Float)
  amount: number;

  @Field(() => String, { nullable: true })
  message?: MaybeType<string>;

  @Field(() => String)
  status: REFUND_STATUS;

  static adapter: FirebaseAdapter<RefundDB, OfferRequestRefundDto>;
}

OfferRequestRefundDto.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    amount: external.amount,
    message: external.message ?? undefined,
    status: external.status,
    updatedAt: Number(external.updatedAt),
  }),
  toExternal: (internal) => ({
    amount: internal.amount,
    message: internal.message,
    status: internal.status,
    updatedAt: new Date(internal.updatedAt),
  }),
});

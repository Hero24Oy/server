import { Field, Float, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB, REFUND_STATUS } from 'hero24-types';

import { MaybeType } from 'src/modules/common/common.types';
import { FirebaseAdapter } from 'src/modules/firebase/firebase-adapter.interfaces';

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
    updatedAt: +external.updatedAt,
  }),
  toExternal: (internal) => ({
    amount: internal.amount,
    message: internal.message,
    status: internal.status,
    updatedAt: new Date(internal.updatedAt),
  }),
});

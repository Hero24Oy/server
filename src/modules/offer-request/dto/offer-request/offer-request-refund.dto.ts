import { Field, Float, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB, REFUND_STATUS } from 'hero24-types';

import { TypeSafeRequired } from 'src/modules/common/common.types';
import { FirebaseGraphQLAdapter } from 'src/modules/firebase/firebase.interfaces';

type OfferRequestRefundShape = {
  updatedAt: Date;
  amount: number;
  message?: string;
  status: REFUND_STATUS;
};

type RefundDB = Exclude<OfferRequestDB['refund'], undefined>;

@ObjectType()
export class OfferRequestRefundDto
  extends FirebaseGraphQLAdapter<OfferRequestRefundShape, RefundDB>
  implements OfferRequestRefundShape
{
  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Float)
  amount: number;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => String)
  status: REFUND_STATUS;

  protected toFirebaseType(): TypeSafeRequired<RefundDB> {
    return {
      amount: this.amount,
      message: this.message,
      status: this.status,
      updatedAt: +this.updatedAt,
    };
  }

  protected fromFirebaseType(
    refund: RefundDB,
  ): TypeSafeRequired<OfferRequestRefundShape> {
    return {
      amount: refund.amount,
      message: refund.message,
      status: refund.status,
      updatedAt: new Date(refund.updatedAt),
    };
  }
}

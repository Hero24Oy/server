import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  PaymentSystem,
  PaymentTransactionStatus,
  PaymentTransactionSubjectType,
  PaymentTransactionType,
} from 'hero24-types';

import { MaybeType } from '$modules/common/common.types';

@ObjectType()
export class TransactionObject {
  @Field(() => PaymentTransactionStatus)
  status: PaymentTransactionStatus;

  @Field(() => PaymentTransactionType)
  type: PaymentTransactionType;

  @Field(() => PaymentSystem)
  service: PaymentSystem;

  @Field(() => String || Int, { nullable: true })
  externalServiceId: MaybeType<string | number>;

  @Field(() => PaymentTransactionSubjectType)
  subjectType: PaymentTransactionSubjectType;

  @Field(() => String)
  subjectId: string;

  @Field(() => Number)
  amount: number;

  @Field(() => String, { nullable: true })
  promotionId?: MaybeType<string>;

  @Field(() => Number, { nullable: true })
  paidAt?: MaybeType<number>;

  @Field(() => Number, { nullable: true })
  createdAt?: MaybeType<number>;
}

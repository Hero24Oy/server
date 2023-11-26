import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  PaymentSystem,
  PaymentTransaction,
  PaymentTransactionStatus,
  PaymentTransactionSubjectType,
  PaymentTransactionType,
} from 'hero24-types';

registerEnumType(PaymentTransactionSubjectType, {
  name: 'PaymentTransactionSubjectType',
});

registerEnumType(PaymentTransactionStatus, {
  name: 'PaymentTransactionStatus',
});

registerEnumType(PaymentTransactionType, {
  name: 'PaymentTransactionType',
});

registerEnumType(PaymentSystem, {
  name: 'PaymentSystem',
});

@ObjectType()
export class TransactionObject implements PaymentTransaction {
  @Field(() => PaymentTransactionStatus)
  status: PaymentTransactionStatus;

  @Field(() => PaymentTransactionType)
  type: PaymentTransactionType;

  @Field(() => PaymentTransactionType)
  service: PaymentSystem;

  @Field(() => String || Int, { nullable: true })
  externalServiceId: string | number | null;

  @Field(() => PaymentTransactionSubjectType)
  subjectType: PaymentTransactionSubjectType;

  @Field(() => String)
  subjectId: string;

  @Field(() => Number)
  amount: number;

  @Field(() => String, { nullable: true })
  promotionId?: string;

  @Field(() => Number, { nullable: true })
  paidAt?: number;

  @Field(() => Number, { nullable: true })
  createdAt?: number;
}

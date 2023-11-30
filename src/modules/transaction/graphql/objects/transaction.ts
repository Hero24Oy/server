import { Field, Float, ObjectType } from '@nestjs/graphql';
import {
  PaymentSystem,
  PaymentTransaction,
  PaymentTransactionStatus,
  PaymentTransactionSubjectType,
  PaymentTransactionType,
} from 'hero24-types';

import { MaybeType } from '$modules/common/common.types';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';
import { isNumeric } from '$utils';

@ObjectType()
export class TransactionObject {
  @Field(() => PaymentTransactionStatus)
  status: PaymentTransactionStatus;

  @Field(() => PaymentTransactionType)
  type: PaymentTransactionType;

  @Field(() => PaymentSystem)
  service: PaymentSystem;

  @Field(() => String, { nullable: true })
  externalServiceId: MaybeType<string>;

  @Field(() => PaymentTransactionSubjectType)
  subjectType: PaymentTransactionSubjectType;

  @Field(() => String)
  subjectId: string;

  @Field(() => Float)
  amount: number;

  @Field(() => Date, { nullable: true })
  paidAt?: MaybeType<Date>;

  @Field(() => Date, { nullable: true })
  createdAt?: MaybeType<Date>;

  static adapter: FirebaseAdapter<PaymentTransaction, TransactionObject>;
}

TransactionObject.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    status: internal.status,
    type: internal.type,
    service: internal.service,
    externalServiceId: String(internal.externalServiceId),
    subjectType: internal.subjectType,
    subjectId: internal.subjectId,
    amount: internal.amount,
    paidAt: internal.paidAt ? new Date(internal.paidAt) : undefined,
    createdAt: internal.createdAt ? new Date(internal.createdAt) : undefined,
  }),
  toInternal: (external) => ({
    status: external.status,
    type: external.type,
    service: external.service,
    externalServiceId: isNumeric(external.externalServiceId)
      ? Number(external.externalServiceId)
      : external.externalServiceId ?? null,
    subjectType: external.subjectType,
    subjectId: external.subjectId,
    amount: external.amount,
    paidAt: external.paidAt?.getTime() ?? undefined,
    createdAt: external.createdAt?.getTime() ?? undefined,
  }),
});

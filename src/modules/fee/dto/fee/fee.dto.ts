import { Field, Float, ObjectType } from '@nestjs/graphql';
import { FeeDB } from 'hero24-types';

import { FeeCategory } from './fee-category.enum';
import { FeeDataDto } from './fee-data.dto';
import { FeeStatus } from './fee-status.enum';

import { MaybeType } from '$/src/modules/common/common.types';
import { FirebaseAdapter } from '$/src/modules/firebase/firebase.adapter';

@ObjectType()
export class FeeDto {
  @Field(() => String)
  id: string;

  @Field(() => FeeDataDto)
  data: FeeDataDto;

  @Field(() => String)
  offerRequestId: string;

  @Field(() => Float, { nullable: true })
  amountPaid?: MaybeType<number>;

  @Field(() => FeeStatus)
  status: FeeStatus;

  @Field(() => FeeCategory)
  feeCategory: FeeCategory;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Float)
  platformFeePercentage: number;

  @Field(() => Float)
  customerVAT: number;

  @Field(() => Float)
  serviceProviderVAT: number;

  @Field(() => String, { nullable: true })
  stripePaymentIntentId?: MaybeType<string>;

  @Field(() => String)
  userId: string;

  static adapter: FirebaseAdapter<FeeDB & { id: string }, FeeDto>;
}

FeeDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    id: internal.id,
    data: FeeDataDto.adapter.toExternal(internal.data),
    offerRequestId: internal.offerRequest,
    amountPaid: internal.amountPaid,
    status: internal.status,
    feeCategory: internal.feeCategory,
    createdAt: new Date(internal.createdAt),
    platformFeePercentage: internal.platformFeePercentage,
    customerVAT: internal.customerVAT,
    serviceProviderVAT: internal.serviceProviderVAT,
    stripePaymentIntentId: internal.stripePaymentIntentId,
    userId: internal.userId,
  }),
  toInternal: (external) => ({
    id: external.id,
    data: FeeDataDto.adapter.toInternal(external.data),
    offerRequest: external.offerRequestId,
    amountPaid: external.amountPaid ?? undefined,
    status: external.status,
    feeCategory: external.feeCategory,
    createdAt: Number(external.createdAt),
    platformFeePercentage: external.platformFeePercentage,
    customerVAT: external.customerVAT,
    serviceProviderVAT: external.serviceProviderVAT,
    stripePaymentIntentId: external.stripePaymentIntentId ?? undefined,
    userId: external.userId,
  }),
});

import { Field, Float, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB, REFUND_STATUS } from 'hero24-types';

import { omitUndefined } from 'src/modules/common/common.utils';

@ObjectType()
export class OfferRequestRefundDto {
  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Float)
  amount: number;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => String)
  status: REFUND_STATUS;

  static convertFromFirebaseType(
    data: Exclude<OfferRequestDB['refund'], undefined>,
  ): OfferRequestRefundDto {
    return {
      ...data,
      updatedAt: new Date(data.updatedAt),
    };
  }

  static convertToFirebaseType(
    data: OfferRequestRefundDto,
  ): Exclude<OfferRequestDB['refund'], undefined> {
    return omitUndefined({
      ...data,
      updatedAt: +new Date(data.updatedAt),
    });
  }
}

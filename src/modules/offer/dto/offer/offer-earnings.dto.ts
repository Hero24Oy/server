import { Field, ObjectType } from '@nestjs/graphql';
import { EARNINGS_STATUS, OfferDB } from 'hero24-types';

import { MaybeType } from 'src/modules/common/common.types';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

@ObjectType()
export class OfferEarningsDto {
  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String, { nullable: true })
  message?: MaybeType<string>;

  @Field(() => String)
  status: EARNINGS_STATUS;

  static adapter: FirebaseAdapter<
    Exclude<OfferDB['earnings'], undefined>,
    OfferEarningsDto
  >;
}

OfferEarningsDto.adapter = new FirebaseAdapter({
  toExternal: ({ updatedAt, message, status }) => ({
    updatedAt: new Date(updatedAt),
    message,
    status,
  }),
  toInternal: ({ updatedAt, message, status }) => ({
    updatedAt: Number(updatedAt),
    message: message ?? undefined,
    status,
  }),
});

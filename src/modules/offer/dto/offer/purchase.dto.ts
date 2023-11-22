import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Purchase } from 'hero24-types';

import { MaybeType } from '$modules/common/common.types';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
export class PurchaseDto {
  @Field(() => String)
  id: string;

  @Field(() => Float)
  duration: number;

  @Field(() => Float)
  pricePerHour: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => String, { nullable: true })
  reason?: MaybeType<string>;

  static adapter: FirebaseAdapter<Purchase & { id: string }, PurchaseDto>;
}

PurchaseDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    id: internal.id,
    createdAt: new Date(internal.createdAt),
    duration: internal.duration,
    pricePerHour: internal.pricePerHour,
    reason: internal.reason,
  }),
  toInternal: (external) => ({
    id: external.id,
    createdAt: Number(external.createdAt),
    duration: external.duration,
    pricePerHour: external.pricePerHour,
    reason: external.reason ?? undefined,
  }),
});

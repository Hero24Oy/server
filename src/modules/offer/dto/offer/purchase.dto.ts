import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Purchase } from 'hero24-types';
import { MaybeType } from 'src/modules/common/common.types';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

@ObjectType()
export class PurchaseDto {
  @Field(() => Float)
  duration: number;

  @Field(() => Float)
  pricePerHour: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => String, { nullable: true })
  reason?: MaybeType<string>;

  static adapter: FirebaseAdapter<Purchase, PurchaseDto>;
}

PurchaseDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    createdAt: new Date(internal.createdAt),
    duration: internal.duration,
    pricePerHour: internal.pricePerHour,
    reason: internal.reason,
  }),
  toInternal: (external) => ({
    createdAt: +external.createdAt,
    duration: external.duration,
    pricePerHour: external.pricePerHour,
    reason: external.reason ?? undefined,
  }),
});

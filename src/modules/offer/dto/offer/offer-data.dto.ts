import { Field, Float, ObjectType } from '@nestjs/graphql';
import { OfferDB } from 'hero24-types';

import { OfferInitialDataDto } from './offer-initial-data.dto';
import { PurchaseDto } from './purchase.dto';
import { WorkTimeDto } from './work-time.dto';

import { isNumber } from '$imports/lodash';
import { MaybeType } from '$modules/common/common.types';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
export class OfferDataDto {
  @Field(() => [PurchaseDto], { nullable: true })
  extensions?: MaybeType<PurchaseDto[]>;

  @Field(() => [WorkTimeDto], { nullable: true })
  workTime?: MaybeType<WorkTimeDto[]>;

  @Field(() => Date, { nullable: true })
  actualStartTime?: MaybeType<Date>;

  @Field(() => Date, { nullable: true })
  actualCompletedTime?: MaybeType<Date>;

  @Field(() => Boolean)
  isPaused: boolean;

  @Field(() => Float, { nullable: true })
  pauseDurationMS?: MaybeType<number>;

  @Field(() => Boolean)
  seenBySeller: boolean;

  @Field(() => OfferInitialDataDto)
  initial: OfferInitialDataDto;

  @Field(() => Boolean, { nullable: true })
  requestedChangesAccepted?: MaybeType<boolean>;

  static adapter: FirebaseAdapter<OfferDB['data'], OfferDataDto>;
}

OfferDataDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    extensions: internal.extensions
      ? internal.extensions.map((purchase) =>
          PurchaseDto.adapter.toExternal(purchase),
        )
      : null,
    workTime: internal.workTime
      ? internal.workTime.map((workTime) =>
          WorkTimeDto.adapter.toExternal(workTime),
        )
      : null,
    actualStartTime: isNumber(internal.actualStartTime)
      ? new Date(internal.actualStartTime)
      : null,
    actualCompletedTime: isNumber(internal.actualCompletedTime)
      ? new Date(internal.actualCompletedTime)
      : null,
    isPaused: internal.isPaused || false,
    pauseDurationMS: internal.pauseDurationMS,
    seenBySeller: internal.seenBySeller,
    initial: OfferInitialDataDto.adapter.toExternal(internal.initial),
    requestedChangesAccepted: internal.requestedChangesAccepted,
  }),
  toInternal: (external) => ({
    extensions: external.extensions
      ? external.extensions.map((purchase) =>
          PurchaseDto.adapter.toInternal(purchase),
        )
      : undefined,
    workTime: external.workTime
      ? external.workTime.map((workTime) =>
          WorkTimeDto.adapter.toInternal(workTime),
        )
      : undefined,
    actualStartTime: external.actualStartTime
      ? Number(external.actualStartTime)
      : undefined,
    actualCompletedTime: external.actualCompletedTime
      ? Number(external.actualCompletedTime)
      : undefined,
    isPaused: external.isPaused,
    pauseDurationMS: external.pauseDurationMS ?? undefined,
    seenBySeller: external.seenBySeller,
    initial: OfferInitialDataDto.adapter.toInternal(external.initial),
    requestedChangesAccepted: external.requestedChangesAccepted ?? undefined,
  }),
});

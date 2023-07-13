import { Field, Float, ObjectType } from '@nestjs/graphql';
import { OfferDB } from 'hero24-types';
import { isNumber } from 'lodash';

import { MaybeType } from 'src/modules/common/common.types';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

import { OfferInitialDataDto } from './offer-initial-data.dto';
import { PurchaseDto } from '../purchase.dto';
import { WorkTimeDto } from '../work-time.dto';

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
      ? internal.extensions.map(PurchaseDto.adapter.toExternal)
      : null,
    workTime: internal.workTime
      ? internal.workTime.map(WorkTimeDto.adapter.toExternal)
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
      ? external.extensions.map(PurchaseDto.adapter.toInternal)
      : undefined,
    workTime: external.workTime
      ? external.workTime.map(WorkTimeDto.adapter.toInternal)
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

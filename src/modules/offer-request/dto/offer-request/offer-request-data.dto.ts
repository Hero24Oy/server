import { Field, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB, OFFER_REQUEST_STATUS } from 'hero24-types';

import { MaybeType } from 'src/modules/common/common.types';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

import { OfferRequestDataChangesAcceptedDto } from './offer-request-data-changes-accepted.dto';
import { OfferRequestDataInitialDto } from './offer-request-data-initial.dto';
import { OfferRequestDataPickServiceProviderDto } from './offer-request-data-pick-service-provider.dto';
import { OfferRequestDataRequestedChangesDto } from './offer-request-data-requested-changes.dto';

type OfferRequestDataDB = OfferRequestDB['data'];

@ObjectType()
export class OfferRequestDataDto {
  @Field(() => Date, { nullable: true })
  actualStartTime?: MaybeType<Date>;

  @Field(() => Boolean, { nullable: true })
  reviewed?: MaybeType<boolean>;

  @Field(() => String)
  status: OFFER_REQUEST_STATUS;

  @Field(() => OfferRequestDataInitialDto)
  initial: OfferRequestDataInitialDto;

  @Field(() => Date, { nullable: true })
  lastAgreedStartTime?: MaybeType<Date>;

  @Field(() => OfferRequestDataRequestedChangesDto, { nullable: true })
  requestedChanges?: MaybeType<OfferRequestDataRequestedChangesDto>;

  @Field(() => OfferRequestDataChangesAcceptedDto, { nullable: true })
  changesAccepted?: MaybeType<OfferRequestDataChangesAcceptedDto>;

  @Field(() => OfferRequestDataPickServiceProviderDto, { nullable: true })
  pickServiceProvider?: MaybeType<OfferRequestDataPickServiceProviderDto>;

  static adapter: FirebaseAdapter<OfferRequestDataDB, OfferRequestDataDto>;
}

OfferRequestDataDto.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    reviewed: external.reviewed ?? undefined,
    status: external.status,
    changesAccepted: external.changesAccepted
      ? OfferRequestDataChangesAcceptedDto.adapter.toInternal(
          external.changesAccepted,
        )
      : undefined,
    initial: OfferRequestDataInitialDto.adapter.toInternal(external.initial),
    requestedChanges: external.requestedChanges
      ? OfferRequestDataRequestedChangesDto.adapter.toInternal(
          external.requestedChanges,
        )
      : undefined,
    pickServiceProvider: external.pickServiceProvider
      ? OfferRequestDataPickServiceProviderDto.adapter.toInternal(
          external.pickServiceProvider,
        )
      : undefined,
    actualStartTime: external.actualStartTime
      ? Number(external.actualStartTime)
      : undefined,
    lastAgreedStartTime: external.lastAgreedStartTime
      ? Number(external.lastAgreedStartTime)
      : undefined,
  }),
  toExternal: (internal) => ({
    reviewed: internal.reviewed,
    changesAccepted: internal.changesAccepted
      ? OfferRequestDataChangesAcceptedDto.adapter.toExternal(
          internal.changesAccepted,
        )
      : undefined,
    status: internal.status,
    initial: OfferRequestDataInitialDto.adapter.toExternal(internal.initial),
    requestedChanges: internal.requestedChanges
      ? OfferRequestDataRequestedChangesDto.adapter.toExternal(
          internal.requestedChanges,
        )
      : null,

    pickServiceProvider:
      internal.pickServiceProvider &&
      OfferRequestDataPickServiceProviderDto.adapter.toExternal(
        internal.pickServiceProvider,
      ),
    actualStartTime:
      typeof internal.actualStartTime === 'number'
        ? new Date(internal.actualStartTime)
        : undefined,
    lastAgreedStartTime:
      typeof internal.lastAgreedStartTime === 'number'
        ? new Date(internal.lastAgreedStartTime)
        : undefined,
  }),
});

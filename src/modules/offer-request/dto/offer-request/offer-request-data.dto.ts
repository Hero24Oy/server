import { Field, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB, OFFER_REQUEST_STATUS } from 'hero24-types';

import { omitUndefined } from 'src/modules/common/common.utils';

import { OfferRequestDataChangesAcceptedDto } from './offer-request-data-changes-accepted.dto';
import { OfferRequestDataInitialDto } from './offer-request-data-initial.dto';
import { OfferRequestDataPickServiceProviderDto } from './offer-request-data-pick-service-provider.dto';
import { OfferRequestDataRequestedChangesDto } from './offer-request-data-requested-changes.dto';

@ObjectType()
export class OfferRequestDataDto {
  @Field(() => Date, { nullable: true })
  actualStartTime?: Date;

  @Field(() => Boolean, { nullable: true })
  reviewed?: boolean;

  @Field(() => String)
  status: OFFER_REQUEST_STATUS;

  @Field(() => OfferRequestDataInitialDto)
  initial: OfferRequestDataInitialDto;

  @Field(() => Date, { nullable: true })
  lastAgreedStartTime?: Date;

  @Field(() => OfferRequestDataRequestedChangesDto, { nullable: true })
  requestedChanges?: OfferRequestDataRequestedChangesDto;

  @Field(() => OfferRequestDataChangesAcceptedDto, { nullable: true })
  changesAccepted?: OfferRequestDataChangesAcceptedDto;

  @Field(() => OfferRequestDataPickServiceProviderDto, { nullable: true })
  pickServiceProvider?: OfferRequestDataPickServiceProviderDto;

  static convertFromFirebaseType(
    data: OfferRequestDB['data'],
  ): OfferRequestDataDto {
    return {
      ...data,
      initial: OfferRequestDataInitialDto.convertFromFirebaseType(data.initial),
      requestedChanges:
        data.requestedChanges &&
        OfferRequestDataRequestedChangesDto.convertFromFirebaseType(
          data.requestedChanges,
        ),
      pickServiceProvider:
        data.pickServiceProvider &&
        OfferRequestDataPickServiceProviderDto.convertFromFirebaseType(
          data.pickServiceProvider,
        ),
      actualStartTime:
        typeof data.actualStartTime === 'number'
          ? new Date(data.actualStartTime)
          : undefined,
      lastAgreedStartTime:
        typeof data.lastAgreedStartTime === 'number'
          ? new Date(data.lastAgreedStartTime)
          : undefined,
    };
  }

  static convertToFirebaseType(
    data: OfferRequestDataDto,
  ): OfferRequestDB['data'] {
    return omitUndefined({
      ...data,
      initial: OfferRequestDataInitialDto.convertToFirebaseType(data.initial),
      requestedChanges: data.requestedChanges
        ? OfferRequestDataRequestedChangesDto.convertToFirebaseType(
            data.requestedChanges,
          )
        : undefined,
      pickServiceProvider: data.pickServiceProvider
        ? OfferRequestDataPickServiceProviderDto.convertToFirebaseType(
            data.pickServiceProvider,
          )
        : undefined,
      actualStartTime: data.actualStartTime ? +data.actualStartTime : undefined,
      lastAgreedStartTime: data.lastAgreedStartTime
        ? +data.lastAgreedStartTime
        : undefined,
    });
  }
}

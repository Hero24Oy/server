import { Field, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB, OFFER_REQUEST_STATUS } from 'hero24-types';

import { OfferRequestDataChangesAcceptedDto } from './offer-request-data-changes-accepted.dto';
import { OfferRequestDataInitialDto } from './offer-request-data-initial.dto';
import { OfferRequestDataPickServiceProviderDto } from './offer-request-data-pick-service-provider.dto';
import { OfferRequestDataRequestedChangesDto } from './offer-request-data-requested-changes.dto';
import { FirebaseGraphQLAdapter } from 'src/modules/firebase/firebase.interfaces';
import { TypeSafeRequired } from 'src/modules/common/common.types';

type OfferRequestDataDB = OfferRequestDB['data'];

type OfferRequestDataShape = {
  actualStartTime?: Date;
  reviewed?: boolean;
  status: OFFER_REQUEST_STATUS;
  initial: OfferRequestDataInitialDto;
  lastAgreedStartTime?: Date;
  requestedChanges?: OfferRequestDataRequestedChangesDto;
  changesAccepted?: OfferRequestDataChangesAcceptedDto;
  pickServiceProvider?: OfferRequestDataPickServiceProviderDto;
};

@ObjectType()
export class OfferRequestDataDto
  extends FirebaseGraphQLAdapter<OfferRequestDataShape, OfferRequestDataDB>
  implements OfferRequestDataShape
{
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

  protected toFirebaseType(): TypeSafeRequired<OfferRequestDataDB> {
    return {
      reviewed: this.reviewed,
      status: this.status,
      changesAccepted: this.changesAccepted,
      initial: this.initial.toFirebase(),
      requestedChanges: this.requestedChanges
        ? this.requestedChanges.toFirebase()
        : undefined,
      pickServiceProvider: this.pickServiceProvider
        ? this.pickServiceProvider.toFirebase()
        : undefined,
      actualStartTime: this.actualStartTime ? +this.actualStartTime : undefined,
      lastAgreedStartTime: this.lastAgreedStartTime
        ? +this.lastAgreedStartTime
        : undefined,
    };
  }
  protected fromFirebaseType(
    data: OfferRequestDataDB,
  ): TypeSafeRequired<OfferRequestDataShape> {
    return {
      reviewed: data.reviewed,
      changesAccepted: data.changesAccepted,
      status: data.status,
      initial: new OfferRequestDataInitialDto().fromFirebase(data.initial),
      requestedChanges:
        data.requestedChanges &&
        new OfferRequestDataRequestedChangesDto().fromFirebase(
          data.requestedChanges,
        ),
      pickServiceProvider:
        data.pickServiceProvider &&
        new OfferRequestDataPickServiceProviderDto().fromFirebase(
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
}

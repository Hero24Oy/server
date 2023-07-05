import { Field, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB, OFFER_REQUEST_STATUS } from 'hero24-types';

import { OfferRequestDataChangesAcceptedDto } from './offer-request-data-changes-accepted.dto';
import { OfferRequestDataInitialDto } from './offer-request-data-initial.dto';
import { OfferRequestDataPickServiceProviderDto } from './offer-request-data-pick-service-provider.dto';
import { OfferRequestDataRequestedChangesDto } from './offer-request-data-requested-changes.dto';
import { FirebaseGraphQLAdapter } from 'src/modules/firebase/firebase.interfaces';
import { MaybeType, TypeSafeRequired } from 'src/modules/common/common.types';

type OfferRequestDataDB = OfferRequestDB['data'];

type OfferRequestDataShape = {
  actualStartTime?: MaybeType<Date>;
  reviewed?: MaybeType<boolean>;
  status: OFFER_REQUEST_STATUS;
  initial: OfferRequestDataInitialDto;
  lastAgreedStartTime?: MaybeType<Date>;
  requestedChanges?: MaybeType<OfferRequestDataRequestedChangesDto>;
  changesAccepted?: MaybeType<OfferRequestDataChangesAcceptedDto>;
  pickServiceProvider?: MaybeType<OfferRequestDataPickServiceProviderDto>;
};

@ObjectType()
export class OfferRequestDataDto
  extends FirebaseGraphQLAdapter<OfferRequestDataShape, OfferRequestDataDB>
  implements OfferRequestDataShape
{
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

  protected toFirebaseType(): TypeSafeRequired<OfferRequestDataDB> {
    return {
      reviewed: this.reviewed ?? undefined,
      status: this.status,
      changesAccepted: this.changesAccepted?.toFirebase(),
      initial: this.initial.toFirebase(),
      requestedChanges: this.requestedChanges?.toFirebase(),
      pickServiceProvider: this.pickServiceProvider?.toFirebase(),
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
      changesAccepted: data.changesAccepted
        ? new OfferRequestDataChangesAcceptedDto().fromFirebase(
            data.changesAccepted,
          )
        : undefined,
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

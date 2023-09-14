import { Field, InputType } from '@nestjs/graphql';
import {
  OFFER_REQUEST_STATUS,
  OfferRequestDB,
  PickStrategy,
} from 'hero24-types';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

import { OfferRequestDataPickServiceProviderDto } from '../offer-request/offer-request-data-pick-service-provider.dto';

import { OfferRequestDataInitialInput } from './offer-request-data-initial.input';

type OfferRequestDataCreationDB = Pick<
  OfferRequestDB['data'],
  'pickServiceProvider' | 'status' | 'initial'
>;

@InputType()
export class OfferRequestDataInput {
  @Field(() => OfferRequestDataInitialInput)
  initial: OfferRequestDataInitialInput;

  @Field(() => OfferRequestDataPickServiceProviderDto)
  pickServiceProvider: OfferRequestDataPickServiceProviderDto;

  static adapter: FirebaseAdapter<
    OfferRequestDataCreationDB,
    OfferRequestDataInput
  >;
}

OfferRequestDataInput.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    status: 'open' as OFFER_REQUEST_STATUS,
    initial: OfferRequestDataInitialInput.adapter.toInternal(external.initial),
    pickServiceProvider:
      OfferRequestDataPickServiceProviderDto.adapter.toInternal(
        external.pickServiceProvider,
      ),
  }),
  toExternal: (internal) => ({
    status: internal.status,
    initial: OfferRequestDataInitialInput.adapter.toExternal(internal.initial),
    pickServiceProvider: internal.pickServiceProvider
      ? OfferRequestDataPickServiceProviderDto.adapter.toExternal(
          internal.pickServiceProvider,
        )
      : {
          pickStrategy: 'first' as PickStrategy,
        },
  }),
});

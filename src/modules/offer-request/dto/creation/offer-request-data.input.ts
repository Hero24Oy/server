import { Field, InputType } from '@nestjs/graphql';
import { OFFER_REQUEST_STATUS, OfferRequestDB } from 'hero24-types';
import { OfferRequestDataInitialInput } from './offer-request-data-initial.input';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';
import { OfferRequestDataPickServiceProviderDto } from '../offer-request/offer-request-data-pick-service-provider.dto';

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
  toExternal() {
    throw new Error('Should be never used');
  },
});

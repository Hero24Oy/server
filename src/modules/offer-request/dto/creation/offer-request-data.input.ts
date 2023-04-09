import { Field, InputType } from '@nestjs/graphql';
import { OfferRequestDB } from 'hero24-types';
import { omitUndefined } from 'src/modules/common/common.utils';
import { OfferRequestDataInitialInput } from './offer-request-data-initial.input';
import { OfferRequestDataPickServiceProviderInput } from './offer-request-data-pick-service-provider.input';

type FirebaseCreationProps = Pick<
  OfferRequestDB['data'],
  'pickServiceProvider' | 'status'
> & {
  initial: OfferRequestDB['data']['initial'];
};

@InputType()
export class OfferRequestDataInput {
  @Field(() => OfferRequestDataInitialInput)
  initial: OfferRequestDataInitialInput;

  @Field(() => OfferRequestDataPickServiceProviderInput)
  pickServiceProvider: OfferRequestDataPickServiceProviderInput;

  static convertToFirebaseType(
    data: OfferRequestDataInput,
  ): FirebaseCreationProps {
    return omitUndefined({
      status: 'open',
      initial: OfferRequestDataInitialInput.convertToFirebaseType(data.initial),
      pickServiceProvider:
        OfferRequestDataPickServiceProviderInput.convertToFirebaseType(
          data.pickServiceProvider,
        ),
    });
  }
}

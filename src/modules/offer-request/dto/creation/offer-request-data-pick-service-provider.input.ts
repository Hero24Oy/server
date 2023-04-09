import { Field, InputType } from '@nestjs/graphql';
import { OfferRequestDB, PickStrategy } from 'hero24-types';
import { convertListToFirebaseMap } from 'src/modules/common/common.utils';

@InputType()
export class OfferRequestDataPickServiceProviderInput {
  @Field(() => String)
  pickStrategy: PickStrategy;

  @Field(() => [String])
  preferred: string[];

  static convertToFirebaseType(
    serviceProviderPicker: OfferRequestDataPickServiceProviderInput,
  ): OfferRequestDB['data']['pickServiceProvider'] {
    return {
      preferred: convertListToFirebaseMap(serviceProviderPicker.preferred),
      pickStrategy: serviceProviderPicker.pickStrategy,
    };
  }
}
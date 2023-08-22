import { ArgsType, Field } from '@nestjs/graphql';
import { OfferRequestCreationInput } from './offer-request-creation.input';

@ArgsType()
export class OfferRequestCreationArgs {
  @Field(() => OfferRequestCreationInput)
  input: OfferRequestCreationInput;
}

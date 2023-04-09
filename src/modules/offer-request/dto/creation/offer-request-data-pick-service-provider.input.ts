import { Field, InputType } from '@nestjs/graphql';
import { PickStrategy } from 'hero24-types';

@InputType()
export class OfferRequestDataPickServiceProviderInput {
  @Field(() => String)
  pickStrategy: PickStrategy;

  @Field(() => [String])
  preferred: string[];
}

import { Field, InputType } from '@nestjs/graphql';
import { InitialDataInput } from './initial-data.input';

@InputType()
export class OfferDataInput {
  @Field(() => InitialDataInput)
  initial: InitialDataInput;
}

import { ArgsType, Field } from '@nestjs/graphql';

import { FeeCreationInput } from './fee-creation.input';

@ArgsType()
export class FeeCreationArgs {
  @Field(() => FeeCreationInput)
  input: FeeCreationInput;
}

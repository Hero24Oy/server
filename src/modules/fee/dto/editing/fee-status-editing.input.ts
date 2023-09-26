import { Field, InputType } from '@nestjs/graphql';

import { FeeStatus } from '../fee/fee-status.enum';

@InputType()
export class FeeStatusEditingInput {
  @Field(() => FeeStatus)
  status: FeeStatus;

  @Field(() => String)
  id: string;
}

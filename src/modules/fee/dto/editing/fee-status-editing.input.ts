import { Field, InputType } from '@nestjs/graphql';
import { FeeStatus } from 'hero24-types';

@InputType()
export class FeeStatusEditingInput {
  @Field(() => String)
  status: FeeStatus;

  @Field(() => String)
  id: string;
}

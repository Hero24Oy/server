import { Field, InputType } from '@nestjs/graphql';
import { WorkTimeInput } from './work-time.input';

@InputType()
export class OfferCompletedInput {
  @Field(() => Date)
  actualStartTime: Date;

  @Field(() => Date)
  actualCompletedTime: Date;

  @Field(() => [WorkTimeInput])
  workTime: WorkTimeInput[];
}

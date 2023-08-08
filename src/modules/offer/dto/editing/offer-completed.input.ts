import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class WorkTimeInput {
  @Field(() => Date)
  startTime: Date;

  @Field(() => Date)
  endTime: Date;
}

@InputType()
export class OfferCompletedInput {
  @Field(() => Date)
  actualStartTime: Date;

  @Field(() => Date)
  actualCompletedTime: Date;

  @Field(() => [WorkTimeInput])
  workTime: WorkTimeInput[];
}

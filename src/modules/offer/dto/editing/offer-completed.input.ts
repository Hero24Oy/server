import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class WorkTimeInput {
  @Field(() => Date)
  startTime: Date;

  @Field(() => Date)
  endTime: Date;
}

@InputType()
export class OfferCompletedInput {
  @Field(() => Float)
  actualStartTime: number;

  @Field(() => Float)
  actualCompletedTime: number;

  @Field(() => [WorkTimeInput])
  workTime: WorkTimeInput[];
}

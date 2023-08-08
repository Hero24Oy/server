import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class WorkTimeInput {
  @Field(() => Date)
  startTime: Date;

  @Field(() => Date)
  endTime: Date;
}

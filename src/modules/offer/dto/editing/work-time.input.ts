import { Field, InputType, PickType } from '@nestjs/graphql';

import { WorkTimeDto } from '../offer/work-time.dto';

@InputType()
export class WorkTimeInput extends PickType(
  WorkTimeDto,
  ['startTime', 'endTime'],
  InputType,
) {
  @Field(() => Date)
  startTime: Date;

  @Field(() => Date)
  endTime: Date;
}

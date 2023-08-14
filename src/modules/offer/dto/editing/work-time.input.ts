import { InputType, PickType } from '@nestjs/graphql';
import { WorkTimeDto } from '../offer/work-time.dto';

@InputType()
export class WorkTimeInput extends PickType(
  WorkTimeDto,
  ['endTime', 'startTime'],
  InputType,
) {
  //? way to make nullable fields required?
}

import { Field, InputType, PickType } from '@nestjs/graphql';

import { WorkTimeInput } from './work-time.input';
import { OfferDataDto } from '../offer/offer-data.dto';

@InputType()
export class OfferCompletedInput extends PickType(OfferDataDto, [
  'actualStartTime',
  'actualCompletedTime',
]) {
  @Field(() => [WorkTimeInput])
  workTime: WorkTimeInput[];
}

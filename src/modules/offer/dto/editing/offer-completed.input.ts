import { Field, InputType, IntersectionType, PickType } from '@nestjs/graphql';

import { WorkTimeInput } from './work-time.input';
import { OfferDataDto } from '../offer/offer-data.dto';
import { OfferIdInput } from './offer-id.input';

@InputType()
export class OfferCompletedInput extends IntersectionType(
  OfferIdInput,
  PickType(OfferDataDto, ['actualStartTime', 'actualCompletedTime'], InputType),
) {
  @Field(() => Date)
  actualStartTime: Date;

  @Field(() => Date)
  actualCompletedTime: Date;

  @Field(() => [WorkTimeInput])
  workTime: WorkTimeInput[];
}

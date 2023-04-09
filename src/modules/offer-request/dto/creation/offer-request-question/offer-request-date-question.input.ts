import { Field, InputType, Int } from '@nestjs/graphql';

import { MaybeType } from 'src/modules/common/common.types';
import { SuitableTimeInput } from 'src/modules/common/dto/suitable-time/suitable-time.input';
import { OfferRequestBaseQuestionInput } from './offer-request-base-question.input';

@InputType()
export class OfferRequestDateQuestionInput extends OfferRequestBaseQuestionInput {
  @Field(() => String)
  type: 'date';

  @Field(() => Int, { nullable: true })
  preferredTime?: MaybeType<number>;

  @Field(() => Int, { nullable: true })
  suitableTimesCount?: MaybeType<number>;

  @Field(() => [SuitableTimeInput], { nullable: true })
  suitableTimes?: MaybeType<SuitableTimeInput[]>;
}

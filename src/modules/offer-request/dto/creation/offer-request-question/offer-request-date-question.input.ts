import { Field, InputType, Int } from '@nestjs/graphql';
import { OfferRequestDateQuestion } from 'hero24-types';

import { MaybeType } from 'src/modules/common/common.types';
import { omitUndefined } from 'src/modules/common/common.utils';
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

  static convertToFirebaseType(
    question: OfferRequestDateQuestionInput,
  ): OfferRequestDateQuestion {
    return omitUndefined({
      ...OfferRequestBaseQuestionInput.convertBaseToFirebaseType(question),
      preferredTime: question.preferredTime || null,
      suitableTimes: question.suitableTimes
        ? SuitableTimeInput.convertToFirebaseTime(question.suitableTimes)
        : null,
      suitableTimesCount:
        typeof question.suitableTimesCount !== 'number'
          ? null
          : question.suitableTimesCount,
    });
  }
}

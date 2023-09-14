import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

import { PlainOfferRequestQuestion } from '../../offer-request-question.types';

import { OfferRequestBaseQuestionDto } from './offer-request-base-question.dto';
import { OfferRequestQuestionType } from './offer-request-question-type.enum';

import { MaybeType } from '$modules/common/common.types';
import { SuitableTimeDto } from '$modules/common/dto/suitable-time/suitable-time.dto';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

type QuestionType = typeof OfferRequestQuestionType.DATE;

type PlainOfferRequestDateQuestion = Extract<
  PlainOfferRequestQuestion,
  { type: QuestionType }
>;

@ObjectType({ implements: () => OfferRequestBaseQuestionDto })
@InputType('OfferRequestDateQuestionInput')
export class OfferRequestDateQuestionDto extends OfferRequestBaseQuestionDto<QuestionType> {
  @Field(() => Date, { nullable: true })
  preferredTime?: MaybeType<Date>;

  @Field(() => Int, { nullable: true })
  suitableTimesCount?: MaybeType<number>;

  @Field(() => [SuitableTimeDto], { nullable: true })
  suitableTimes?: MaybeType<SuitableTimeDto[]>;

  static adapter: FirebaseAdapter<
    PlainOfferRequestDateQuestion,
    OfferRequestDateQuestionDto
  >;
}

OfferRequestDateQuestionDto.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    ...OfferRequestBaseQuestionDto.adapter.toInternal(external),
    type: OfferRequestQuestionType.DATE,
    preferredTime: external.preferredTime
      ? Number(external.preferredTime)
      : null,
    suitableTimesCount: external.suitableTimesCount || null,
    suitableTimes: external.suitableTimes
      ? SuitableTimeDto.convertToFirebaseTime(external.suitableTimes)
      : null,
  }),
  toExternal: (internal) => ({
    ...OfferRequestBaseQuestionDto.adapter.toExternal(internal),
    type: OfferRequestQuestionType.DATE,
    preferredTime:
      typeof internal.preferredTime === 'number'
        ? new Date(internal.preferredTime)
        : null,
    suitableTimesCount: internal.suitableTimesCount,
    suitableTimes: internal.suitableTimes
      ? SuitableTimeDto.convertFromFirebaseTime(internal.suitableTimes)
      : null,
  }),
});

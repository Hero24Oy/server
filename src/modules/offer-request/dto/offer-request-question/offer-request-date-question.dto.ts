import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

import { MaybeType, TypeSafeRequired } from 'src/modules/common/common.types';
import { SuitableTimeDto } from 'src/modules/common/dto/suitable-time/suitable-time.dto';

import {
  BaseOfferRequestQuestionDB,
  BaseOfferRequestQuestionShape,
  OfferRequestBaseQuestionDto,
} from './offer-request-base-question.dto';
import { PlainOfferRequestQuestion } from '../../offer-request-questions.types';

type QuestionType = 'date';

type OfferRequestDateQuestionAdapterShape =
  BaseOfferRequestQuestionShape<QuestionType> & {
    preferredTime?: MaybeType<Date>;
    suitableTimesCount?: MaybeType<number>;
    suitableTimes?: MaybeType<SuitableTimeDto[]>;
  };

type PlainOfferRequestDateQuestion = PlainOfferRequestQuestion & {
  type: QuestionType;
};

export type OfferRequestDateQuestionInputShape =
  OfferRequestDateQuestionAdapterShape;

@ObjectType({ implements: () => OfferRequestBaseQuestionDto })
@InputType('OfferRequestDateQuestionInput')
export class OfferRequestDateQuestionDto extends OfferRequestBaseQuestionDto<
  QuestionType,
  OfferRequestDateQuestionAdapterShape,
  PlainOfferRequestDateQuestion
> {
  @Field(() => Date, { nullable: true })
  preferredTime?: MaybeType<Date>;

  @Field(() => Int, { nullable: true })
  suitableTimesCount?: MaybeType<number>;

  @Field(() => [SuitableTimeDto], { nullable: true })
  suitableTimes?: MaybeType<SuitableTimeDto[]>;

  protected toFirebaseType(): TypeSafeRequired<
    PlainOfferRequestDateQuestion & BaseOfferRequestQuestionDB<QuestionType>
  > {
    return {
      ...this.toBaseFirebaseType(),
      preferredTime: this.preferredTime ? +this.preferredTime : null,
      suitableTimesCount: this.suitableTimesCount || null,
      suitableTimes: this.suitableTimes
        ? SuitableTimeDto.convertToFirebaseTime(this.suitableTimes)
        : null,
    };
  }

  protected fromFirebaseType(
    firebase: PlainOfferRequestDateQuestion,
  ): TypeSafeRequired<OfferRequestDateQuestionAdapterShape> {
    return {
      ...this.fromBaseFirebaseType(firebase),
      preferredTime:
        typeof firebase.preferredTime === 'number'
          ? new Date(firebase.preferredTime)
          : null,
      suitableTimesCount: firebase.suitableTimesCount,
      suitableTimes: firebase.suitableTimes
        ? SuitableTimeDto.convertFromFirebaseTime(firebase.suitableTimes)
        : null,
    };
  }
}

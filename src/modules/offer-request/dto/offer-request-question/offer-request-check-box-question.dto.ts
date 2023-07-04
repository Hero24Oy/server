import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { TypeSafeRequired } from 'src/modules/common/common.types';
import {
  BaseOfferRequestQuestionDB,
  BaseOfferRequestQuestionShape,
  OfferRequestBaseQuestionDto,
} from './offer-request-base-question.dto';
import {
  OfferRequestQuestionOptionDto,
  OfferRequestQuestionOptionInputShape,
} from './offer-request-question-option.dto';
import { PlainOfferRequestQuestion } from '../../offer-request-questions.types';

type QuestionType = 'checkbox';

type OfferRequestCheckBoxQuestionAdapterShape =
  BaseOfferRequestQuestionShape<QuestionType> & {
    options: OfferRequestQuestionOptionDto[];
  };

type PlainOfferRequestCheckBoxQuestion = PlainOfferRequestQuestion & {
  type: QuestionType;
};

export type OfferRequestCheckBoxQuestionInputShape =
  BaseOfferRequestQuestionShape<QuestionType> & {
    options: OfferRequestQuestionOptionInputShape[];
  };

@ObjectType({ implements: () => OfferRequestBaseQuestionDto })
@InputType('OfferRequestCheckBoxQuestionInput')
export class OfferRequestCheckBoxQuestionDto extends OfferRequestBaseQuestionDto<
  QuestionType,
  OfferRequestCheckBoxQuestionAdapterShape,
  PlainOfferRequestCheckBoxQuestion
> {
  constructor(shape?: OfferRequestCheckBoxQuestionInputShape) {
    const options = (shape?.options || []).map(
      (option) => new OfferRequestQuestionOptionDto(option),
    );

    super(shape && { ...shape, options });
  }

  @Field(() => [OfferRequestQuestionOptionDto])
  options: OfferRequestQuestionOptionDto[];

  protected toFirebaseType(): TypeSafeRequired<
    PlainOfferRequestCheckBoxQuestion & BaseOfferRequestQuestionDB<QuestionType>
  > {
    return {
      ...this.toBaseFirebaseType(),
      options: this.options.map((option) => option.toFirebase()),
    };
  }

  protected fromFirebaseType(
    firebase: PlainOfferRequestCheckBoxQuestion,
  ): TypeSafeRequired<OfferRequestCheckBoxQuestionAdapterShape> {
    return {
      ...this.fromBaseFirebaseType(firebase),
      options: firebase.options.map((option) =>
        new OfferRequestQuestionOptionDto().fromFirebase(option),
      ),
    };
  }
}

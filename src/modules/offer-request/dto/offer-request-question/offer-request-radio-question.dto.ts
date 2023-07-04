import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { MaybeType, TypeSafeRequired } from 'src/modules/common/common.types';
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

type QuestionType = 'radio';

type OfferRequestRadioQuestionAdapterShape =
  BaseOfferRequestQuestionShape<QuestionType> & {
    selectedOption?: MaybeType<string>;
    options: OfferRequestQuestionOptionDto[];
  };

type PlainOfferRequestRadioQuestion = PlainOfferRequestQuestion & {
  type: QuestionType;
};

export type OfferRequestRadioQuestionInputShape =
  BaseOfferRequestQuestionShape<QuestionType> & {
    selectedOption?: MaybeType<string>;
    options: OfferRequestQuestionOptionInputShape[];
  };

@ObjectType({ implements: () => OfferRequestBaseQuestionDto })
@InputType('OfferRequestRadioQuestionInput')
export class OfferRequestRadioQuestionDto extends OfferRequestBaseQuestionDto<
  QuestionType,
  OfferRequestRadioQuestionAdapterShape,
  PlainOfferRequestRadioQuestion
> {
  constructor(shape?: OfferRequestRadioQuestionInputShape) {
    super(
      shape && {
        ...shape,
        options: shape.options.map(
          (option) => new OfferRequestQuestionOptionDto(option),
        ),
      },
    );
  }

  @Field(() => String, { nullable: true })
  selectedOption?: MaybeType<string>;

  @Field(() => [OfferRequestQuestionOptionDto])
  options: OfferRequestQuestionOptionDto[];

  protected toFirebaseType(): TypeSafeRequired<
    PlainOfferRequestRadioQuestion & BaseOfferRequestQuestionDB<QuestionType>
  > {
    return {
      ...this.toBaseFirebaseType(),
      selectedOption: this.selectedOption || null,
      options: this.options.map((option) => option.toFirebase()),
    };
  }

  protected fromFirebaseType(
    firebase: PlainOfferRequestRadioQuestion,
  ): TypeSafeRequired<OfferRequestRadioQuestionAdapterShape> {
    return {
      ...this.fromBaseFirebaseType(firebase),
      selectedOption: firebase.selectedOption,
      options: firebase.options.map((option) =>
        new OfferRequestQuestionOptionDto().fromFirebase(option),
      ),
    };
  }
}

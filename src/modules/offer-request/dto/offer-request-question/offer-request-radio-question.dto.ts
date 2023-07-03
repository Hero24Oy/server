import { Field, ObjectType } from '@nestjs/graphql';
import { MaybeType, TypeSafeRequired } from 'src/modules/common/common.types';
import {
  BaseOfferRequestQuestionDB,
  BaseOfferRequestShape,
  OfferRequestBaseQuestionDto,
} from './offer-request-base-question.dto';
import { OfferRequestQuestionOptionDto } from './offer-request-question-option.dto';
import { PlainOfferRequestQuestion } from '../../offer-request-questions.types';

type QuestionType = 'radio';

type RadioQuestionShape = {
  selectedOption?: MaybeType<string>;
  options: OfferRequestQuestionOptionDto[];
};

type PlainOfferRequestRadioQuestion = PlainOfferRequestQuestion & {
  type: QuestionType;
};

@ObjectType()
export class OfferRequestRadioQuestionDto extends OfferRequestBaseQuestionDto<
  QuestionType,
  RadioQuestionShape,
  PlainOfferRequestRadioQuestion
> {
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
  ): TypeSafeRequired<
    RadioQuestionShape & BaseOfferRequestShape<QuestionType>
  > {
    return {
      ...this.fromBaseFirebaseType(firebase),
      selectedOption: firebase.selectedOption,
      options: firebase.options.map((option) =>
        new OfferRequestQuestionOptionDto().fromFirebase(option),
      ),
    };
  }
}

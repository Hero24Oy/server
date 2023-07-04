import { Field, ObjectType } from '@nestjs/graphql';
import { TypeSafeRequired } from 'src/modules/common/common.types';
import {
  BaseOfferRequestQuestionDB,
  BaseOfferRequestShape,
  OfferRequestBaseQuestionDto,
} from './offer-request-base-question.dto';
import { OfferRequestQuestionOptionDto } from './offer-request-question-option.dto';
import { PlainOfferRequestQuestion } from '../../offer-request-questions.types';

type QuestionType = 'checkbox';

type OfferRequestCheckBoxQuestionShape = {
  options: OfferRequestQuestionOptionDto[];
};

type PlainOfferRequestCheckBoxQuestion = PlainOfferRequestQuestion & {
  type: QuestionType;
};

@ObjectType({ implements: () => OfferRequestBaseQuestionDto })
export class OfferRequestCheckBoxQuestionDto extends OfferRequestBaseQuestionDto<
  QuestionType,
  OfferRequestCheckBoxQuestionShape,
  PlainOfferRequestCheckBoxQuestion
> {
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
  ): TypeSafeRequired<
    OfferRequestCheckBoxQuestionShape & BaseOfferRequestShape<QuestionType>
  > {
    return {
      ...this.fromBaseFirebaseType(firebase),
      options: firebase.options.map((option) =>
        new OfferRequestQuestionOptionDto().fromFirebase(option),
      ),
    };
  }
}

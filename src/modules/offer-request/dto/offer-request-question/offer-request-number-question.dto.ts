import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { MaybeType, TypeSafeRequired } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import {
  BaseOfferRequestQuestionDB,
  BaseOfferRequestQuestionShape,
  OfferRequestBaseQuestionDto,
} from './offer-request-base-question.dto';
import { PlainOfferRequestQuestion } from '../../offer-request-questions.types';

type QuestionType = 'number';

type OfferRequestNumberQuestionAdapterShape =
  BaseOfferRequestQuestionShape<QuestionType> & {
    placeholder?: MaybeType<TranslationFieldDto>;
    numericValue?: MaybeType<number>;
  };

type PlainOfferRequestNumberQuestion = PlainOfferRequestQuestion & {
  type: QuestionType;
};

export type OfferRequestNumberQuestionInputShape =
  OfferRequestNumberQuestionAdapterShape;

@ObjectType({ implements: () => OfferRequestBaseQuestionDto })
@InputType('OfferRequestNumberQuestionInput')
export class OfferRequestNumberQuestionDto extends OfferRequestBaseQuestionDto<
  QuestionType,
  OfferRequestNumberQuestionAdapterShape,
  PlainOfferRequestNumberQuestion
> {
  @Field(() => TranslationFieldDto, { nullable: true })
  placeholder?: MaybeType<TranslationFieldDto>;

  @Field(() => Float, { nullable: true })
  numericValue?: MaybeType<number>;

  protected toFirebaseType(): TypeSafeRequired<
    PlainOfferRequestNumberQuestion & BaseOfferRequestQuestionDB<QuestionType>
  > {
    return {
      ...this.toBaseFirebaseType(),
      placeholder: this.placeholder || null,
      value: this.numericValue || null,
    };
  }

  protected fromFirebaseType(
    firebase: PlainOfferRequestNumberQuestion,
  ): TypeSafeRequired<OfferRequestNumberQuestionAdapterShape> {
    return {
      ...this.fromBaseFirebaseType(firebase),
      placeholder: firebase.placeholder,
      numericValue: firebase.value,
    };
  }
}

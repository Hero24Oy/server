import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { MaybeType, TypeSafeRequired } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import {
  BaseOfferRequestQuestionDB,
  BaseOfferRequestQuestionShape,
  OfferRequestBaseQuestionDto,
} from './offer-request-base-question.dto';
import { PlainOfferRequestQuestion } from '../../offer-request-questions.types';

type QuestionType = 'number_input';

type OfferRequestNumberInputQuestionAdapterShape =
  BaseOfferRequestQuestionShape<QuestionType> & {
    placeholder?: MaybeType<TranslationFieldDto>;
    extra_placeholder?: MaybeType<TranslationFieldDto>;
    value?: MaybeType<string>;
  };

type PlainOfferRequestNumberInputQuestion = PlainOfferRequestQuestion & {
  type: QuestionType;
};

export type OfferRequestNumberInputQuestionInputShape =
  OfferRequestNumberInputQuestionAdapterShape;

@ObjectType({ implements: () => OfferRequestBaseQuestionDto })
@InputType('OfferRequestNumberInputQuestionInput')
export class OfferRequestNumberInputQuestionDto extends OfferRequestBaseQuestionDto<
  QuestionType,
  OfferRequestNumberInputQuestionAdapterShape,
  PlainOfferRequestNumberInputQuestion
> {
  @Field(() => TranslationFieldDto, { nullable: true })
  placeholder?: MaybeType<TranslationFieldDto>;

  @Field(() => TranslationFieldDto, { nullable: true })
  extra_placeholder?: MaybeType<TranslationFieldDto>;

  @Field(() => String, { nullable: true })
  value?: MaybeType<string>;

  protected toFirebaseType(): TypeSafeRequired<
    PlainOfferRequestNumberInputQuestion &
      BaseOfferRequestQuestionDB<QuestionType>
  > {
    return {
      ...this.toBaseFirebaseType(),
      placeholder: this.placeholder || null,
      extra_placeholder: this.extra_placeholder || null,
      value: this.value || null,
    };
  }

  protected fromFirebaseType(
    firebase: PlainOfferRequestNumberInputQuestion,
  ): TypeSafeRequired<OfferRequestNumberInputQuestionAdapterShape> {
    return {
      ...this.fromBaseFirebaseType(firebase),
      placeholder: firebase.placeholder,
      extra_placeholder: firebase.extra_placeholder,
      value: firebase.value,
    };
  }
}

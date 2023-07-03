import { Field, ObjectType } from '@nestjs/graphql';
import { MaybeType, TypeSafeRequired } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import {
  BaseOfferRequestQuestionDB,
  BaseOfferRequestShape,
  OfferRequestBaseQuestionDto,
} from './offer-request-base-question.dto';
import { PlainOfferRequestQuestion } from '../../offer-request-questions.types';

type QuestionType = 'number_input';

type OfferRequestNumberInputQuestionShape = {
  placeholder?: MaybeType<TranslationFieldDto>;
  extra_placeholder?: MaybeType<TranslationFieldDto>;
  value?: MaybeType<string>;
};

type PlainOfferRequestNumberInputQuestion = PlainOfferRequestQuestion & {
  type: QuestionType;
};

@ObjectType()
export class OfferRequestNumberInputQuestionDto extends OfferRequestBaseQuestionDto<
  QuestionType,
  OfferRequestNumberInputQuestionShape,
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
  ): TypeSafeRequired<
    OfferRequestNumberInputQuestionShape & BaseOfferRequestShape<QuestionType>
  > {
    return {
      ...this.fromBaseFirebaseType(firebase),
      placeholder: firebase.placeholder,
      extra_placeholder: firebase.extra_placeholder,
      value: firebase.value,
    };
  }
}

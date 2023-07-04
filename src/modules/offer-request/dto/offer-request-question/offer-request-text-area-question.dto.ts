import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { MaybeType, TypeSafeRequired } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import {
  BaseOfferRequestQuestionDB,
  BaseOfferRequestQuestionShape,
  OfferRequestBaseQuestionDto,
} from './offer-request-base-question.dto';
import { PlainOfferRequestQuestion } from '../../offer-request-questions.types';

type QuestionType = 'textarea';

type OfferRequestTextAreaQuestionAdapterShape =
  BaseOfferRequestQuestionShape<QuestionType> & {
    placeholder?: MaybeType<TranslationFieldDto>;
    value?: MaybeType<string>;
  };

type PlainOfferRequestTextAreaQuestion = PlainOfferRequestQuestion & {
  type: QuestionType;
};

export type OfferRequestTextAreaQuestionInputShape =
  OfferRequestTextAreaQuestionAdapterShape;

@ObjectType({ implements: () => OfferRequestBaseQuestionDto })
@InputType('OfferRequestTextAreaQuestionInput')
export class OfferRequestTextAreaQuestionDto extends OfferRequestBaseQuestionDto<
  QuestionType,
  OfferRequestTextAreaQuestionAdapterShape,
  PlainOfferRequestTextAreaQuestion
> {
  @Field(() => TranslationFieldDto, { nullable: true })
  placeholder?: MaybeType<TranslationFieldDto>;

  @Field(() => String, { nullable: true })
  value?: MaybeType<string>;

  protected toFirebaseType(): TypeSafeRequired<
    PlainOfferRequestTextAreaQuestion & BaseOfferRequestQuestionDB<QuestionType>
  > {
    return {
      ...this.toBaseFirebaseType(),
      placeholder: this.placeholder || null,
      value: this.value || null,
    };
  }

  protected fromFirebaseType(
    firebase: PlainOfferRequestTextAreaQuestion,
  ): TypeSafeRequired<OfferRequestTextAreaQuestionAdapterShape> {
    return {
      ...this.fromBaseFirebaseType(firebase),
      placeholder: firebase.placeholder,
      value: firebase.value,
    };
  }
}

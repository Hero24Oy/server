import { Field, ObjectType } from '@nestjs/graphql';
import { MaybeType, TypeSafeRequired } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import {
  BaseOfferRequestQuestionDB,
  BaseOfferRequestShape,
  OfferRequestBaseQuestionDto,
} from './offer-request-base-question.dto';
import { PlainOfferRequestQuestion } from '../../offer-request-questions.types';

type QuestionType = 'textarea';

type OfferRequestTextAreaQuestionShape = {
  placeholder?: MaybeType<TranslationFieldDto>;
  value?: MaybeType<string>;
};

type PlainOfferRequestTextAreaQuestion = PlainOfferRequestQuestion & {
  type: QuestionType;
};

@ObjectType({ implements: () => OfferRequestBaseQuestionDto })
export class OfferRequestTextAreaQuestionDto extends OfferRequestBaseQuestionDto<
  QuestionType,
  OfferRequestTextAreaQuestionShape,
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
  ): TypeSafeRequired<
    OfferRequestTextAreaQuestionShape & BaseOfferRequestShape<QuestionType>
  > {
    return {
      ...this.fromBaseFirebaseType(firebase),
      placeholder: firebase.placeholder,
      value: firebase.value,
    };
  }
}

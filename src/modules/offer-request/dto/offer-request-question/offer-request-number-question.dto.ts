import { Field, Float, ObjectType } from '@nestjs/graphql';
import { MaybeType, TypeSafeRequired } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import {
  BaseOfferRequestQuestionDB,
  BaseOfferRequestShape,
  OfferRequestBaseQuestionDto,
} from './offer-request-base-question.dto';
import { PlainOfferRequestQuestion } from '../../offer-request-questions.types';

type QuestionType = 'number';

type OfferRequestNumberQuestionShape = {
  placeholder?: MaybeType<TranslationFieldDto>;
  numericValue?: MaybeType<number>;
};

type PlainOfferRequestNumberQuestion = PlainOfferRequestQuestion & {
  type: QuestionType;
};

@ObjectType()
export class OfferRequestNumberQuestionDto extends OfferRequestBaseQuestionDto<
  QuestionType,
  OfferRequestNumberQuestionShape,
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
  ): TypeSafeRequired<
    OfferRequestNumberQuestionShape & BaseOfferRequestShape<QuestionType>
  > {
    return {
      ...this.fromBaseFirebaseType(firebase),
      placeholder: firebase.placeholder,
      numericValue: firebase.value,
    };
  }
}

import { Field, Float, ObjectType } from '@nestjs/graphql';
import { MaybeType, TypeSafeRequired } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import {
  BaseOfferRequestQuestionDB,
  BaseOfferRequestShape,
  OfferRequestBaseQuestionDto,
} from './offer-request-base-question.dto';
import { PlainOfferRequestQuestion } from '../../offer-request-questions.types';

type QuestionType = 'list';

type OfferRequestListPickerShape = {
  placeholder?: MaybeType<TranslationFieldDto>;
  numericValue?: MaybeType<number>;
};

type PlainOfferRequestListQuestion = PlainOfferRequestQuestion & {
  type: QuestionType;
};

@ObjectType({ implements: () => OfferRequestBaseQuestionDto })
export class OfferRequestListPickerDto extends OfferRequestBaseQuestionDto<
  QuestionType,
  OfferRequestListPickerShape,
  PlainOfferRequestListQuestion
> {
  @Field(() => TranslationFieldDto, { nullable: true })
  placeholder?: MaybeType<TranslationFieldDto>;

  @Field(() => Float, { nullable: true })
  numericValue?: MaybeType<number>;

  protected toFirebaseType(): TypeSafeRequired<
    PlainOfferRequestListQuestion & BaseOfferRequestQuestionDB<QuestionType>
  > {
    return {
      ...this.toBaseFirebaseType(),
      placeholder: this.placeholder || null,
      value: this.numericValue || null,
    };
  }

  protected fromFirebaseType(
    firebase: PlainOfferRequestListQuestion,
  ): TypeSafeRequired<
    OfferRequestListPickerShape & BaseOfferRequestShape<QuestionType>
  > {
    return {
      ...this.fromBaseFirebaseType(firebase),
      placeholder: firebase.placeholder,
      numericValue: firebase.value,
    };
  }
}

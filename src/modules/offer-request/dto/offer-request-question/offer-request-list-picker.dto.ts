import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { MaybeType, TypeSafeRequired } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import {
  BaseOfferRequestQuestionDB,
  BaseOfferRequestQuestionShape,
  OfferRequestBaseQuestionDto,
} from './offer-request-base-question.dto';
import { PlainOfferRequestQuestion } from '../../offer-request-questions.types';

type QuestionType = 'list';

type OfferRequestListPickerAdapterShape =
  BaseOfferRequestQuestionShape<QuestionType> & {
    placeholder?: MaybeType<TranslationFieldDto>;
    numericValue?: MaybeType<number>;
  };

type PlainOfferRequestListQuestion = PlainOfferRequestQuestion & {
  type: QuestionType;
};

export type OfferRequestListPickerInputShape =
  OfferRequestListPickerAdapterShape;

@ObjectType({ implements: () => OfferRequestBaseQuestionDto })
@InputType('OfferRequestListQuestionInput')
export class OfferRequestListPickerDto extends OfferRequestBaseQuestionDto<
  QuestionType,
  OfferRequestListPickerAdapterShape,
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
  ): TypeSafeRequired<OfferRequestListPickerAdapterShape> {
    return {
      ...this.fromBaseFirebaseType(firebase),
      placeholder: firebase.placeholder,
      numericValue: firebase.value,
    };
  }
}

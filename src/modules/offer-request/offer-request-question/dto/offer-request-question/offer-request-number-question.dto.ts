import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';

import { PlainOfferRequestQuestion } from '../../offer-request-question.types';

import { OfferRequestBaseQuestionDto } from './offer-request-base-question.dto';
import { OfferRequestQuestionType } from './offer-request-question-type.enum';

import { MaybeType } from '$modules/common/common.types';
import { TranslationFieldDto } from '$modules/common/dto/translation-field.dto';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

type QuestionType = typeof OfferRequestQuestionType.NUMBER;

type PlainOfferRequestNumberQuestion = PlainOfferRequestQuestion & {
  type: QuestionType;
};

@ObjectType({ implements: () => OfferRequestBaseQuestionDto })
@InputType('OfferRequestNumberQuestionInput')
export class OfferRequestNumberQuestionDto extends OfferRequestBaseQuestionDto<QuestionType> {
  @Field(() => TranslationFieldDto, { nullable: true })
  placeholder?: MaybeType<TranslationFieldDto>;

  @Field(() => Float, { nullable: true })
  numericValue?: MaybeType<number>;

  static adapter: FirebaseAdapter<
    PlainOfferRequestNumberQuestion,
    OfferRequestNumberQuestionDto
  >;
}

OfferRequestNumberQuestionDto.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    ...OfferRequestBaseQuestionDto.adapter.toInternal(external),
    type: OfferRequestQuestionType.NUMBER,
    placeholder: external.placeholder || null,
    value: external.numericValue || null,
  }),
  toExternal: (internal) => ({
    ...OfferRequestBaseQuestionDto.adapter.toExternal(internal),
    type: OfferRequestQuestionType.NUMBER,
    placeholder: internal.placeholder,
    numericValue: internal.value,
  }),
});

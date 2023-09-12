import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { PlainOfferRequestQuestion } from '../../offer-request-question.types';

import { OfferRequestBaseQuestionDto } from './offer-request-base-question.dto';
import { OfferRequestQuestionType } from './offer-request-question-type.enum';

import { MaybeType } from '$/src/modules/common/common.types';
import { TranslationFieldDto } from '$/src/modules/common/dto/translation-field.dto';
import { FirebaseAdapter } from '$/src/modules/firebase/firebase.adapter';

type QuestionType = typeof OfferRequestQuestionType.NUMBER_INPUT;

type PlainOfferRequestNumberInputQuestion = PlainOfferRequestQuestion & {
  type: QuestionType;
};

@ObjectType({ implements: () => OfferRequestBaseQuestionDto })
@InputType('OfferRequestNumberInputQuestionInput')
export class OfferRequestNumberInputQuestionDto extends OfferRequestBaseQuestionDto<QuestionType> {
  @Field(() => TranslationFieldDto, { nullable: true })
  placeholder?: MaybeType<TranslationFieldDto>;

  @Field(() => TranslationFieldDto, { nullable: true })
  extra_placeholder?: MaybeType<TranslationFieldDto>;

  @Field(() => String, { nullable: true })
  value?: MaybeType<string>;

  static adapter: FirebaseAdapter<
    PlainOfferRequestNumberInputQuestion,
    OfferRequestNumberInputQuestionDto
  >;
}

OfferRequestNumberInputQuestionDto.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    ...OfferRequestBaseQuestionDto.adapter.toInternal(external),
    type: OfferRequestQuestionType.NUMBER_INPUT,
    placeholder: external.placeholder || null,
    extra_placeholder: external.extra_placeholder || null,
    value: external.value || null,
  }),
  toExternal: (internal) => ({
    ...OfferRequestBaseQuestionDto.adapter.toExternal(internal),
    type: OfferRequestQuestionType.NUMBER_INPUT,
    placeholder: internal.placeholder,
    extra_placeholder: internal.extra_placeholder,
    value: internal.value,
  }),
});

import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

import { OfferRequestQuestionType } from '../../offer-request-question.constants';
import { PlainOfferRequestQuestion } from '../../offer-request-question.types';

import { OfferRequestBaseQuestionDto } from './offer-request-base-question.dto';

type QuestionType = typeof OfferRequestQuestionType.TEXTAREA;

type PlainOfferRequestTextAreaQuestion = PlainOfferRequestQuestion & {
  type: QuestionType;
};

@ObjectType({ implements: () => OfferRequestBaseQuestionDto })
@InputType('OfferRequestTextAreaQuestionInput')
export class OfferRequestTextAreaQuestionDto extends OfferRequestBaseQuestionDto<QuestionType> {
  @Field(() => TranslationFieldDto, { nullable: true })
  placeholder?: MaybeType<TranslationFieldDto>;

  @Field(() => String, { nullable: true })
  value?: MaybeType<string>;

  static adapter: FirebaseAdapter<
    PlainOfferRequestTextAreaQuestion,
    OfferRequestTextAreaQuestionDto
  >;
}

OfferRequestTextAreaQuestionDto.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    ...OfferRequestBaseQuestionDto.adapter.toInternal(external),
    type: OfferRequestQuestionType.TEXTAREA,
    placeholder: external.placeholder || null,
    value: external.value || null,
  }),
  toExternal: (internal) => ({
    ...OfferRequestBaseQuestionDto.adapter.toExternal(internal),
    type: OfferRequestQuestionType.TEXTAREA,
    placeholder: internal.placeholder,
    value: internal.value,
  }),
});

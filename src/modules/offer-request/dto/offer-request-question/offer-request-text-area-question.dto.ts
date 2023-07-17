import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { MaybeType } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

import { PlainOfferRequestQuestion } from '../../offer-request-questions.types';
import { OfferRequestBaseQuestionDto } from './offer-request-base-question.dto';

type QuestionType = 'textarea';

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
    type: 'textarea' as QuestionType,
    placeholder: external.placeholder || null,
    value: external.value || null,
  }),
  toExternal: (internal) => ({
    ...OfferRequestBaseQuestionDto.adapter.toExternal(internal),
    type: 'textarea' as QuestionType,
    placeholder: internal.placeholder,
    value: internal.value,
  }),
});

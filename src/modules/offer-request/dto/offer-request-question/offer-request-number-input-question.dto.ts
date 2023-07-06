import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { MaybeType } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { FirebaseAdapter } from 'src/modules/firebase/firebase-adapter.interfaces';
import { PlainOfferRequestQuestion } from '../../offer-request-questions.types';
import { OfferRequestBaseQuestionDto } from './offer-request-base-question.dto';

type QuestionType = 'number_input';

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
  toInternal(external) {
    return {
      ...OfferRequestBaseQuestionDto.adapter.toInternal(external),
      type: 'number_input' as QuestionType,
      placeholder: external.placeholder || null,
      extra_placeholder: external.extra_placeholder || null,
      value: external.value || null,
    };
  },

  toExternal(internal) {
    return {
      ...OfferRequestBaseQuestionDto.adapter.toExternal(internal),
      type: 'number_input' as QuestionType,
      placeholder: internal.placeholder,
      extra_placeholder: internal.extra_placeholder,
      value: internal.value,
    };
  },
});

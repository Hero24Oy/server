import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';

import { MaybeType } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { FirebaseAdapter } from 'src/modules/firebase/firebase-adapter.interfaces';

import { PlainOfferRequestQuestion } from '../../offer-request-questions.types';
import { OfferRequestBaseQuestionDto } from './offer-request-base-question.dto';

type QuestionType = 'list';

type PlainOfferRequestListQuestion = PlainOfferRequestQuestion & {
  type: QuestionType;
};

@ObjectType({ implements: () => OfferRequestBaseQuestionDto })
@InputType('OfferRequestListQuestionInput')
export class OfferRequestListPickerDto extends OfferRequestBaseQuestionDto<QuestionType> {
  @Field(() => TranslationFieldDto, { nullable: true })
  placeholder?: MaybeType<TranslationFieldDto>;

  @Field(() => Float, { nullable: true })
  numericValue?: MaybeType<number>;

  static adapter: FirebaseAdapter<
    PlainOfferRequestListQuestion,
    OfferRequestListPickerDto
  >;
}

OfferRequestListPickerDto.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    ...OfferRequestBaseQuestionDto.adapter.toInternal(external),
    type: 'list' as QuestionType,
    placeholder: external.placeholder || null,
    value: external.numericValue || null,
  }),
  toExternal: (internal) => ({
    ...OfferRequestBaseQuestionDto.adapter.toExternal(internal),
    type: 'list' as QuestionType,
    placeholder: internal.placeholder,
    numericValue: internal.value,
  }),
});

import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';

import { MaybeType } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { FirebaseAdapter } from 'src/modules/firebase/firebase-adapter.interfaces';

import { PlainOfferRequestQuestion } from '../../offer-request-questions.types';
import { OfferRequestBaseQuestionDto } from './offer-request-base-question.dto';

type QuestionType = 'number';

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
  toInternal(external) {
    return {
      ...OfferRequestBaseQuestionDto.adapter.toInternal(external),
      type: 'number' as QuestionType,
      placeholder: external.placeholder || null,
      value: external.numericValue || null,
    };
  },
  toExternal(internal) {
    return {
      ...OfferRequestBaseQuestionDto.adapter.toInternal(internal),
      type: 'number' as QuestionType,
      placeholder: internal.placeholder,
      numericValue: internal.value,
    };
  },
});

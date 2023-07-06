import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { MaybeType } from 'src/modules/common/common.types';
import { FirebaseAdapter } from 'src/modules/firebase/firebase-adapter.interfaces';

import { PlainOfferRequestQuestion } from '../../offer-request-questions.types';
import { OfferRequestBaseQuestionDto } from './offer-request-base-question.dto';
import { OfferRequestQuestionOptionDto } from './offer-request-question-option.dto';

type QuestionType = 'radio';

type PlainOfferRequestRadioQuestion = PlainOfferRequestQuestion & {
  type: QuestionType;
};

@ObjectType({ implements: () => OfferRequestBaseQuestionDto })
@InputType('OfferRequestRadioQuestionInput')
export class OfferRequestRadioQuestionDto extends OfferRequestBaseQuestionDto<QuestionType> {
  @Field(() => String, { nullable: true })
  selectedOption?: MaybeType<string>;

  @Field(() => [OfferRequestQuestionOptionDto])
  options: OfferRequestQuestionOptionDto[];

  static adapter: FirebaseAdapter<
    PlainOfferRequestRadioQuestion,
    OfferRequestRadioQuestionDto
  >;
}

OfferRequestRadioQuestionDto.adapter = new FirebaseAdapter({
  toInternal(external) {
    return {
      ...OfferRequestBaseQuestionDto.adapter.toInternal(external),
      type: 'radio' as QuestionType,
      selectedOption: external.selectedOption || null,
      options: external.options.map((option) =>
        OfferRequestQuestionOptionDto.adapter.toInternal(option),
      ),
    };
  },
  toExternal(internal) {
    return {
      ...OfferRequestBaseQuestionDto.adapter.toExternal(internal),
      type: 'radio' as QuestionType,
      selectedOption: internal.selectedOption,
      options: internal.options.map((option) =>
        OfferRequestQuestionOptionDto.adapter.toExternal(option),
      ),
    };
  },
});

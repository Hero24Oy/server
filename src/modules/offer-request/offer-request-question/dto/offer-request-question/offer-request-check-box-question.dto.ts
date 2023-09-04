import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

import { OfferRequestBaseQuestionDto } from './offer-request-base-question.dto';
import { OfferRequestQuestionOptionDto } from './offer-request-question-option.dto';
import { PlainOfferRequestQuestion } from '../../offer-request-question.types';
import { OfferRequestQuestionType } from '../../offer-request-question.constants';

type QuestionType = typeof OfferRequestQuestionType.CHECKBOX;

type PlainOfferRequestCheckBoxQuestion = PlainOfferRequestQuestion & {
  type: QuestionType;
};

@ObjectType({ implements: () => OfferRequestBaseQuestionDto })
@InputType('OfferRequestCheckBoxQuestionInput')
export class OfferRequestCheckBoxQuestionDto extends OfferRequestBaseQuestionDto<QuestionType> {
  @Field(() => [OfferRequestQuestionOptionDto])
  options: OfferRequestQuestionOptionDto[];

  static adapter: FirebaseAdapter<
    PlainOfferRequestCheckBoxQuestion,
    OfferRequestCheckBoxQuestionDto
  >;
}

OfferRequestCheckBoxQuestionDto.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    ...OfferRequestBaseQuestionDto.adapter.toInternal(external),
    type: OfferRequestQuestionType.CHECKBOX,
    options: external.options.map((option) =>
      OfferRequestQuestionOptionDto.adapter.toInternal(option),
    ),
  }),
  toExternal: (internal) => ({
    ...OfferRequestBaseQuestionDto.adapter.toExternal(internal),
    type: OfferRequestQuestionType.CHECKBOX,
    options: internal.options.map((option) =>
      OfferRequestQuestionOptionDto.adapter.toExternal(option),
    ),
  }),
});

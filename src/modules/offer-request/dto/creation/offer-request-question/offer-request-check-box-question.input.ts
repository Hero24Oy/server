import { Field, InputType } from '@nestjs/graphql';
import { OfferRequestCheckBoxQuestion } from 'hero24-types';
import { omitUndefined } from 'src/modules/common/common.utils';

import { OfferRequestBaseQuestionInput } from './offer-request-base-question.input';
import { OfferRequestQuestionOptionInput } from './offer-request-question-option.input';
import { OfferRequestQuestionInput } from './offer-request-question.input';

@InputType()
export class OfferRequestCheckBoxQuestionInput extends OfferRequestBaseQuestionInput {
  @Field(() => String)
  type: 'checkbox';

  @Field(() => [OfferRequestQuestionOptionInput])
  options: OfferRequestQuestionOptionInput[];

  static convertToFirebaseType(
    question: OfferRequestCheckBoxQuestionInput,
    plainQuestions: OfferRequestQuestionInput[],
  ): OfferRequestCheckBoxQuestion {
    return omitUndefined({
      ...OfferRequestBaseQuestionInput.convertBaseToFirebaseType(question),
      options: question.options.map((option) =>
        OfferRequestQuestionOptionInput.convertToFirebaseType(
          option,
          plainQuestions,
        ),
      ),
    });
  }
}

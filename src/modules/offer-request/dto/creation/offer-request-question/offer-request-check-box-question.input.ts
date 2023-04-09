import { Field, InputType } from '@nestjs/graphql';

import { OfferRequestBaseQuestionInput } from './offer-request-base-question.input';
import { OfferRequestQuestionOptionInput } from './offer-request-question-option.input';

@InputType()
export class OfferRequestCheckBoxQuestionInput extends OfferRequestBaseQuestionInput {
  @Field(() => String)
  type: 'checkbox';

  @Field(() => [OfferRequestQuestionOptionInput])
  options: OfferRequestQuestionOptionInput[];
}

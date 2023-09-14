import { Field, InputType } from '@nestjs/graphql';

import { OfferRequestQuestionInput } from '../../offer-request-question/dto/offer-request-question/offer-request-question.input';

import { OfferRequestIdInput } from '$modules/offer/dto/editing/offer-request-id.input';

@InputType()
export class OfferRequestUpdateQuestionsInput extends OfferRequestIdInput {
  @Field(() => [OfferRequestQuestionInput])
  questions: OfferRequestQuestionInput[];
}

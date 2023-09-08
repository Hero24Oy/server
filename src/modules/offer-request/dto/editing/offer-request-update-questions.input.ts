import { OfferRequestIdInput } from 'src/modules/offer/dto/editing/offer-request-id.input';
import { OfferRequestQuestionInput } from '../../offer-request-question/dto/offer-request-question/offer-request-question.input';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class OfferRequestUpdateQuestionsInput extends OfferRequestIdInput {
  @Field(() => [OfferRequestQuestionInput])
  questions: OfferRequestQuestionInput[];
}

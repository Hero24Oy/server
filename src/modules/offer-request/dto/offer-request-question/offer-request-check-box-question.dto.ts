import { Field, ObjectType } from '@nestjs/graphql';
import { OfferRequestBaseQuestionDto } from './offer-request-base-question.dto';
import { OfferRequestQuestionOptionDto } from './offer-request-question-option.dto';

@ObjectType()
export class OfferRequestCheckBoxQuestionDto extends OfferRequestBaseQuestionDto {
  @Field(() => String)
  type: 'checkbox';

  @Field(() => [OfferRequestQuestionOptionDto])
  options: OfferRequestQuestionOptionDto[];
}

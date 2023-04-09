import { Field, ObjectType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { OfferRequestBaseQuestionDto } from './offer-request-base-question.dto';
import { OfferRequestQuestionOptionDto } from './offer-request-question-option.dto';

@ObjectType()
export class OfferRequestRadioQuestionDto extends OfferRequestBaseQuestionDto {
  @Field(() => String)
  type: 'radio';

  @Field(() => String, { nullable: true })
  selectedOption?: MaybeType<string>;

  @Field(() => [OfferRequestQuestionOptionDto])
  options: OfferRequestQuestionOptionDto[];
}

import { Field, InputType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { OfferRequestBaseQuestionInput } from './offer-request-base-question.input';
import { OfferRequestQuestionOptionInput } from './offer-request-question-option.input';

@InputType()
export class OfferRequestRadioQuestionInput extends OfferRequestBaseQuestionInput {
  @Field(() => String)
  type: 'radio';

  @Field(() => String, { nullable: true })
  selectedOption?: MaybeType<string>;

  @Field(() => [OfferRequestQuestionOptionInput])
  options: OfferRequestQuestionOptionInput[];
}

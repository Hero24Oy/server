import { Field, Int, InputType } from '@nestjs/graphql';

import { MaybeType } from 'src/modules/common/common.types';
import { TranslationFieldInput } from 'src/modules/common/dto/translation-field.input';
import { OfferRequestBaseQuestionInput } from './offer-request-base-question.input';

@InputType()
export class OfferRequestListPickerInput extends OfferRequestBaseQuestionInput {
  @Field(() => String)
  type: 'list';

  @Field(() => TranslationFieldInput, { nullable: true })
  placeholder?: MaybeType<TranslationFieldInput>;

  @Field(() => Int, { nullable: true })
  numericValue?: MaybeType<number>;
}

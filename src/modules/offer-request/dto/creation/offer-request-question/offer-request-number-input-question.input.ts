import { Field, InputType } from '@nestjs/graphql';

import { MaybeType } from 'src/modules/common/common.types';
import { TranslationFieldInput } from 'src/modules/common/dto/translation-field.input';
import { OfferRequestBaseQuestionInput } from './offer-request-base-question.input';

@InputType()
export class OfferRequestNumberInputQuestionInput extends OfferRequestBaseQuestionInput {
  @Field(() => String)
  type: 'number_input';

  @Field(() => TranslationFieldInput, { nullable: true })
  placeholder?: MaybeType<TranslationFieldInput>;

  @Field(() => TranslationFieldInput, { nullable: true })
  extra_placeholder?: MaybeType<TranslationFieldInput>;

  @Field(() => String, { nullable: true })
  value?: MaybeType<string>;
}

import { Field, InputType } from '@nestjs/graphql';

import { MaybeType } from 'src/modules/common/common.types';
import { TranslationFieldInput } from 'src/modules/common/dto/translation-field.input';
import { OfferRequestBaseQuestionInput } from './offer-request-base-question.input';

@InputType()
export class OfferRequestTextAreaQuestionInput extends OfferRequestBaseQuestionInput {
  @Field(() => String)
  type: 'textarea';

  @Field(() => TranslationFieldInput, { nullable: true })
  placeholder?: MaybeType<TranslationFieldInput>;

  @Field(() => String, { nullable: true })
  value?: MaybeType<string>;
}

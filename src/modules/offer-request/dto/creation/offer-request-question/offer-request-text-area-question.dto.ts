import { Field, InputType } from '@nestjs/graphql';
import { OfferRequestTextAreaQuestion } from 'hero24-types';

import { MaybeType } from 'src/modules/common/common.types';
import { omitUndefined } from 'src/modules/common/common.utils';
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

  static convertToFirebaseType(
    question: OfferRequestTextAreaQuestionInput,
  ): OfferRequestTextAreaQuestion {
    return omitUndefined({
      ...OfferRequestBaseQuestionInput.convertBaseToFirebaseType(question),
      placeholder: question.placeholder || null,
      value: question.value || null,
    });
  }
}

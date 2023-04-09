import { Field, InputType } from '@nestjs/graphql';
import { OfferRequestNumberInputQuestion } from 'hero24-types';

import { MaybeType } from 'src/modules/common/common.types';
import { omitUndefined } from 'src/modules/common/common.utils';
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

  static convertToFirebaseType(
    question: OfferRequestNumberInputQuestionInput,
  ): OfferRequestNumberInputQuestion {
    return omitUndefined({
      ...OfferRequestBaseQuestionInput.convertBaseToFirebaseType(question),
      placeholder: question.placeholder || null,
      extra_placeholder: question.extra_placeholder || null,
      value: question.value || null,
    });
  }
}

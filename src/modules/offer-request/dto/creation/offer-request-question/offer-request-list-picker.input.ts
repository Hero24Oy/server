import { Field, Float, InputType } from '@nestjs/graphql';
import { OfferRequestListPicker } from 'hero24-types';

import { MaybeType } from 'src/modules/common/common.types';
import { omitUndefined } from 'src/modules/common/common.utils';
import { TranslationFieldInput } from 'src/modules/common/dto/translation-field.input';
import { OfferRequestBaseQuestionInput } from './offer-request-base-question.input';

@InputType()
export class OfferRequestListPickerInput extends OfferRequestBaseQuestionInput {
  @Field(() => String)
  type: 'list';

  @Field(() => TranslationFieldInput, { nullable: true })
  placeholder?: MaybeType<TranslationFieldInput>;

  @Field(() => Float, { nullable: true })
  numericValue?: MaybeType<number>;

  static convertToFirebaseType(
    question: OfferRequestListPickerInput,
  ): OfferRequestListPicker {
    return omitUndefined({
      ...OfferRequestBaseQuestionInput.convertBaseToFirebaseType(question),
      placeholder: question.placeholder || null,
      value: question.numericValue || null,
    });
  }
}

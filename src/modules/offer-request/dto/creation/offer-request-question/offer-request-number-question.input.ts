import { Field, Float, InputType } from '@nestjs/graphql';
import { OfferRequestNumberQuestion } from 'hero24-types';
import { MaybeType } from 'src/modules/common/common.types';
import { omitUndefined } from 'src/modules/common/common.utils';
import { TranslationFieldInput } from 'src/modules/common/dto/translation-field.input';
import { OfferRequestBaseQuestionInput } from './offer-request-base-question.input';

@InputType()
export class OfferRequestNumberQuestionInput extends OfferRequestBaseQuestionInput {
  @Field(() => String)
  type: 'number';

  @Field(() => TranslationFieldInput, { nullable: true })
  placeholder?: MaybeType<TranslationFieldInput>;

  @Field(() => Float, { nullable: true })
  numericValue?: MaybeType<number>;

  static convertToFirebaseType(
    question: OfferRequestNumberQuestionInput,
  ): OfferRequestNumberQuestion {
    return omitUndefined({
      ...OfferRequestBaseQuestionInput.convertBaseToFirebaseType(question),
      placeholder: question.placeholder || null,
      value: question.numericValue || null,
    });
  }
}

import { Field, InputType } from '@nestjs/graphql';
import { OfferRequestRadioQuestion } from 'hero24-types';
import { MaybeType } from 'src/modules/common/common.types';
import { omitUndefined } from 'src/modules/common/common.utils';
import { OfferRequestBaseQuestionInput } from './offer-request-base-question.input';
import { OfferRequestQuestionOptionInput } from './offer-request-question-option.input';
import { OfferRequestQuestionInput } from './offer-request-question.input';

@InputType()
export class OfferRequestRadioQuestionInput extends OfferRequestBaseQuestionInput {
  @Field(() => String)
  type: 'radio';

  @Field(() => String, { nullable: true })
  selectedOption?: MaybeType<string>;

  @Field(() => [OfferRequestQuestionOptionInput])
  options: OfferRequestQuestionOptionInput[];

  static convertToFirebaseType(
    question: OfferRequestRadioQuestionInput,
    plainQuestions: OfferRequestQuestionInput[],
  ): OfferRequestRadioQuestion {
    return omitUndefined({
      ...OfferRequestBaseQuestionInput.convertBaseToFirebaseType(question),
      options: question.options.map((option) =>
        OfferRequestQuestionOptionInput.convertToFirebaseType(
          option,
          plainQuestions,
        ),
      ),
      selectedOption: question.selectedOption || null,
    });
  }
}

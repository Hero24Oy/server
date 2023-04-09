import { Field, InputType } from '@nestjs/graphql';
import { OfferRequestQuestion } from 'hero24-types';

import { OfferRequestCheckBoxQuestionInput } from './offer-request-check-box-question.input';
import { OfferRequestDateQuestionInput } from './offer-request-date-question.input';
import { OfferRequestImageQuestionInput } from './offer-request-image-question.input';
import { OfferRequestListPickerInput } from './offer-request-list-picker.input';
import { OfferRequestNumberInputQuestionInput } from './offer-request-number-input-question.input';
import { OfferRequestNumberQuestionInput } from './offer-request-number-question.input';
import { OfferRequestRadioQuestionInput } from './offer-request-radio-question.dto';
import { OfferRequestTextAreaQuestionInput } from './offer-request-text-area-question.dto';

@InputType()
export class OfferRequestQuestionInput {
  @Field(() => String, { nullable: true })
  depsId?: string; // undefined for the root question

  @Field(() => OfferRequestRadioQuestionInput, { nullable: true })
  radio?: OfferRequestRadioQuestionInput;

  @Field(() => OfferRequestCheckBoxQuestionInput, { nullable: true })
  checkbox?: OfferRequestCheckBoxQuestionInput;

  @Field(() => OfferRequestTextAreaQuestionInput, { nullable: true })
  textarea?: OfferRequestTextAreaQuestionInput;

  @Field(() => OfferRequestListPickerInput, { nullable: true })
  list?: OfferRequestListPickerInput;

  @Field(() => OfferRequestNumberQuestionInput, { nullable: true })
  number?: OfferRequestNumberQuestionInput;

  @Field(() => OfferRequestDateQuestionInput, { nullable: true })
  date?: OfferRequestDateQuestionInput;

  @Field(() => OfferRequestImageQuestionInput, { nullable: true })
  image?: OfferRequestImageQuestionInput;

  @Field(() => OfferRequestNumberInputQuestionInput, { nullable: true })
  numberInput?: OfferRequestNumberInputQuestionInput;

  static convertToFirebaseType(
    data: OfferRequestQuestionInput,
    plainQuestions: OfferRequestQuestionInput[],
  ): OfferRequestQuestion {
    if (data.radio) {
      return OfferRequestRadioQuestionInput.convertToFirebaseType(
        data.radio,
        plainQuestions,
      );
    }

    if (data.checkbox) {
      return OfferRequestCheckBoxQuestionInput.convertToFirebaseType(
        data.checkbox,
        plainQuestions,
      );
    }

    if (data.textarea) {
      return OfferRequestTextAreaQuestionInput.convertToFirebaseType(
        data.textarea,
      );
    }

    if (data.list) {
      return OfferRequestListPickerInput.convertToFirebaseType(data.list);
    }

    if (data.number) {
      return OfferRequestNumberQuestionInput.convertToFirebaseType(data.number);
    }

    if (data.date) {
      return OfferRequestDateQuestionInput.convertToFirebaseType(data.date);
    }

    if (data.image) {
      return OfferRequestImageQuestionInput.convertToFirebaseType(data.image);
    }

    if (data.numberInput) {
      return OfferRequestNumberInputQuestionInput.convertToFirebaseType(
        data.numberInput,
      );
    }

    throw new Error('Unknown question type');
  }
}

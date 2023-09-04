import { Field, InputType } from '@nestjs/graphql';

import { TypeSafeRequired } from 'src/modules/common/common.types';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

import { OfferRequestRadioQuestionDto } from './offer-request-radio-question.dto';
import { OfferRequestCheckBoxQuestionDto } from './offer-request-check-box-question.dto';
import { OfferRequestTextAreaQuestionDto } from './offer-request-text-area-question.dto';
import { OfferRequestListPickerDto } from './offer-request-list-picker.dto';
import { OfferRequestNumberQuestionDto } from './offer-request-number-question.dto';
import { OfferRequestDateQuestionDto } from './offer-request-date-question.dto';
import { OfferRequestImageQuestionDto } from './offer-request-image-question.dto';
import { OfferRequestNumberInputQuestionDto } from './offer-request-number-input-question.dto';
import { PlainOfferRequestQuestion } from '../../offer-request-question.types';
import { OfferRequestQuestionAdapter } from './offer-request-question.dto';

@InputType()
export class OfferRequestQuestionInput {
  @Field(() => OfferRequestRadioQuestionDto, { nullable: true })
  radio?: OfferRequestRadioQuestionDto;

  @Field(() => OfferRequestCheckBoxQuestionDto, { nullable: true })
  checkbox?: OfferRequestCheckBoxQuestionDto;

  @Field(() => OfferRequestTextAreaQuestionDto, { nullable: true })
  textarea?: OfferRequestTextAreaQuestionDto;

  @Field(() => OfferRequestListPickerDto, { nullable: true })
  list?: OfferRequestListPickerDto;

  @Field(() => OfferRequestNumberQuestionDto, { nullable: true })
  number?: OfferRequestNumberQuestionDto;

  @Field(() => OfferRequestDateQuestionDto, { nullable: true })
  date?: OfferRequestDateQuestionDto;

  @Field(() => OfferRequestImageQuestionDto, { nullable: true })
  image?: OfferRequestImageQuestionDto;

  @Field(() => OfferRequestNumberInputQuestionDto, { nullable: true })
  numberInput?: OfferRequestNumberInputQuestionDto;

  static adapter: FirebaseAdapter<
    PlainOfferRequestQuestion,
    OfferRequestQuestionInput
  >;
}

OfferRequestQuestionInput.adapter = new FirebaseAdapter({
  toInternal(external): TypeSafeRequired<PlainOfferRequestQuestion> {
    const question =
      external.checkbox ||
      external.date ||
      external.image ||
      external.list ||
      external.number ||
      external.numberInput ||
      external.radio ||
      external.textarea;

    if (question) {
      return OfferRequestQuestionAdapter.toInternal(question);
    }

    throw new Error("Question wasn't provided");
  },
  toExternal() {
    throw new Error('It should be never used');
  },
});

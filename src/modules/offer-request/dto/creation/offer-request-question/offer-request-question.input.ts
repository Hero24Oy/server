import { Field, InputType } from '@nestjs/graphql';
import { OfferRequestQuestion } from 'hero24-types';
import { SuitableTimeInput } from 'src/modules/common/dto/suitable-time/suitable-time.input';

import { OfferRequestCheckBoxQuestionInput } from './offer-request-check-box-question.input';
import { OfferRequestDateQuestionInput } from './offer-request-date-question.input';
import { OfferRequestImageQuestionInput } from './offer-request-image-question.input';
import { OfferRequestListPickerInput } from './offer-request-list-picker.input';
import { OfferRequestNumberInputQuestionInput } from './offer-request-number-input-question.input';
import { OfferRequestNumberQuestionInput } from './offer-request-number-question.input';
import { OfferRequestQuestionOptionInput } from './offer-request-question-option.input';
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
}

const convertToFirebaseType = (
  data: OfferRequestQuestionInput,
  plainQuestions: OfferRequestQuestionInput[],
): OfferRequestQuestion => {
  if (data.radio) {
    return {
      ...data.radio,
      ...(data.radio.selectedOption
        ? { selectedOption: data.radio.selectedOption }
        : { selectedOption: null }),
      options: data.radio.options.map((option) =>
        OfferRequestQuestionOptionInput.convertToFirebaseType(
          option,
          plainQuestions,
        ),
      ),
      name: data.radio.name || null,
    };
  }

  if (data.checkbox) {
    return {
      ...data.checkbox,
      name: data.checkbox.name || null,
      options: data.checkbox.options.map((option) =>
        OfferRequestQuestionOptionInput.convertToFirebaseType(
          option,
          plainQuestions,
        ),
      ),
    };
  }

  if (data.textarea) {
    return {
      ...data.textarea,
      name: data.textarea.name || null,
      placeholder: data.textarea.placeholder || null,
      value: data.textarea.value || null,
    };
  }

  if (data.list) {
    return {
      ...data.list,
      name: data.list.name || null,
      placeholder: data.list.placeholder || null,
      value:
        typeof data.list.numericValue !== 'number'
          ? null
          : data.list.numericValue,
    };
  }

  if (data.number) {
    return {
      ...data.number,
      name: data.number.name || null,
      placeholder: data.number.placeholder || null,
      value:
        typeof data.number.numericValue !== 'number'
          ? null
          : data.number.numericValue,
    };
  }

  if (data.date) {
    return {
      ...data.date,
      name: data.date.name || null,
      preferredTime: data.date.preferredTime || null,
      suitableTimes: data.date.suitableTimes
        ? SuitableTimeInput.convertToFirebaseTime(data.date.suitableTimes)
        : null,
      suitableTimesCount:
        typeof data.date.suitableTimesCount !== 'number'
          ? null
          : data.date.suitableTimesCount,
    };
  }

  if (data.image) {
    return {
      ...data.image,
      name: data.image.name || null,
      images: data.image.images
        ? Object.fromEntries(data.image.images.map((id) => [id, true]))
        : null,
      imageCount:
        typeof data.image.imageCount !== 'number'
          ? null
          : data.image.imageCount,
    };
  }

  if (data.numberInput) {
    return {
      ...data.numberInput,
      name: data.numberInput.name || null,
      placeholder: data.numberInput.placeholder || null,
      extra_placeholder: data.numberInput.extra_placeholder || null,
      value: data.numberInput.value || null,
    };
  }

  throw new Error('Unknown question type');
};

const convertFromFirebaseType = (
  data: OfferRequestQuestion,
  saveQuestion: (question: OfferRequestQuestion) => string, // return depsId
): OfferRequestQuestionInput => {
  let order = typeof data.order === 'number' ? data.order : Number(data.order);

  if (Number.isNaN(order)) {
    order = 0;
  }

  switch (data.type) {
    case 'radio':
      return {
        radio: {
          ...data,
          order,
          options: data.options.map((option) =>
            OfferRequestQuestionOptionInput.convertFromFirebaseType(
              option,
              saveQuestion,
            ),
          ),
        },
      };
    case 'checkbox':
      return {
        checkbox: {
          ...data,
          order,
          options: data.options.map((option) =>
            OfferRequestQuestionOptionInput.convertFromFirebaseType(
              option,
              saveQuestion,
            ),
          ),
        },
      };
    case 'date':
      return {
        date: {
          ...data,
          order,
          suitableTimes: data.suitableTimes
            ? SuitableTimeInput.convertFromFirebaseTime(data.suitableTimes)
            : null,
        },
      };
    case 'image':
      return {
        image: {
          ...data,
          order,
          images: Object.keys(data.images || {}),
        },
      };
    case 'list':
      return {
        list: {
          ...data,
          order,
          numericValue: data.value,
        },
      };
    case 'number':
      return {
        number: {
          ...data,
          order,
          numericValue: data.value,
        },
      };
    case 'textarea':
      return {
        textarea: {
          ...data,
          order,
        },
      };
    case 'number_input':
      return {
        numberInput: {
          ...data,
          order,
        },
      };
  }
};

export const offerRequestQuestionInputConvertor = {
  convertToFirebaseType,
  convertFromFirebaseType,
};

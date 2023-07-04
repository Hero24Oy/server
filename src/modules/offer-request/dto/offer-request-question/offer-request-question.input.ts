import { Field, InputType } from '@nestjs/graphql';
import {
  OfferRequestRadioQuestionDto,
  OfferRequestRadioQuestionInputShape,
} from './offer-request-radio-question.dto';
import {
  OfferRequestCheckBoxQuestionDto,
  OfferRequestCheckBoxQuestionInputShape,
} from './offer-request-check-box-question.dto';
import {
  OfferRequestTextAreaQuestionDto,
  OfferRequestTextAreaQuestionInputShape,
} from './offer-request-text-area-question.dto';
import {
  OfferRequestListPickerDto,
  OfferRequestListPickerInputShape,
} from './offer-request-list-picker.dto';
import {
  OfferRequestNumberQuestionDto,
  OfferRequestNumberQuestionInputShape,
} from './offer-request-number-question.dto';
import {
  OfferRequestDateQuestionDto,
  OfferRequestDateQuestionInputShape,
} from './offer-request-date-question.dto';
import {
  OfferRequestImageQuestionDto,
  OfferRequestImageQuestionInputShape,
} from './offer-request-image-question.dto';
import {
  OfferRequestNumberInputQuestionDto,
  OfferRequestNumberInputQuestionInputShape,
} from './offer-request-number-input-question.dto';
import { FirebaseGraphQLAdapter } from 'src/modules/firebase/firebase.interfaces';
import { PlainOfferRequestQuestion } from '../../offer-request-questions.types';
import { TypeSafeRequired } from 'src/modules/common/common.types';

type OfferRequestQuestionAdapterShape = {
  radio?: OfferRequestRadioQuestionDto;
  checkbox?: OfferRequestCheckBoxQuestionDto;
  textarea?: OfferRequestTextAreaQuestionDto;
  list?: OfferRequestListPickerDto;
  number?: OfferRequestNumberQuestionDto;
  date?: OfferRequestDateQuestionDto;
  image?: OfferRequestImageQuestionDto;
  numberInput?: OfferRequestNumberInputQuestionDto;
};

type PlainOfferRequestQuestionDB = PlainOfferRequestQuestion & {
  depsId?: string;
};

export type OfferRequestQuestionInputShape = {
  radio?: OfferRequestRadioQuestionInputShape;
  checkbox?: OfferRequestCheckBoxQuestionInputShape;
  textarea?: OfferRequestTextAreaQuestionInputShape;
  list?: OfferRequestListPickerInputShape;
  number?: OfferRequestNumberQuestionInputShape;
  date?: OfferRequestDateQuestionInputShape;
  image?: OfferRequestImageQuestionInputShape;
  numberInput?: OfferRequestNumberInputQuestionInputShape;
};

@InputType()
export class OfferRequestQuestionInput extends FirebaseGraphQLAdapter<
  OfferRequestQuestionAdapterShape,
  PlainOfferRequestQuestionDB
> {
  constructor(shape?: OfferRequestQuestionInputShape) {
    super(
      shape && {
        radio: shape.radio && new OfferRequestRadioQuestionDto(shape.radio),
        checkbox:
          shape.checkbox && new OfferRequestCheckBoxQuestionDto(shape.checkbox),
        textarea:
          shape.textarea && new OfferRequestTextAreaQuestionDto(shape.textarea),
        list: shape.list && new OfferRequestListPickerDto(shape.list),
        number: shape.number && new OfferRequestNumberQuestionDto(shape.number),
        date: shape.date && new OfferRequestDateQuestionDto(shape.date),
        image: shape.image && new OfferRequestImageQuestionDto(shape.image),
        numberInput:
          shape.numberInput &&
          new OfferRequestNumberInputQuestionDto(shape.numberInput),
      },
    );
  }

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

  protected toFirebaseType(): TypeSafeRequired<PlainOfferRequestQuestionDB> {
    if (this.radio) {
      return this.radio.toFirebase() as TypeSafeRequired<PlainOfferRequestQuestionDB>;
    }

    if (this.checkbox) {
      return this.checkbox.toFirebase() as TypeSafeRequired<PlainOfferRequestQuestionDB>;
    }

    if (this.textarea) {
      return this.textarea.toFirebase() as TypeSafeRequired<PlainOfferRequestQuestionDB>;
    }

    if (this.list) {
      return this.list.toFirebase() as TypeSafeRequired<PlainOfferRequestQuestionDB>;
    }

    if (this.number) {
      return this.number.toFirebase() as TypeSafeRequired<PlainOfferRequestQuestionDB>;
    }

    if (this.date) {
      return this.date.toFirebase() as TypeSafeRequired<PlainOfferRequestQuestionDB>;
    }

    if (this.image) {
      return this.image.toFirebase() as TypeSafeRequired<PlainOfferRequestQuestionDB>;
    }

    if (this.numberInput) {
      return this.numberInput.toFirebase() as TypeSafeRequired<PlainOfferRequestQuestionDB>;
    }

    throw new Error("Question wasn't provided");
  }

  public fromFirebaseType(
    firebase: PlainOfferRequestQuestion,
  ): TypeSafeRequired<OfferRequestQuestionAdapterShape> {
    const question: TypeSafeRequired<OfferRequestQuestionAdapterShape> = {
      checkbox: undefined,
      date: undefined,
      image: undefined,
      list: undefined,
      number: undefined,
      numberInput: undefined,
      radio: undefined,
      textarea: undefined,
    };

    switch (firebase.type) {
      case 'checkbox':
        question.checkbox = new OfferRequestCheckBoxQuestionDto().fromFirebase(
          firebase,
        );
        break;
      case 'date':
        question.date = new OfferRequestDateQuestionDto().fromFirebase(
          firebase,
        );
        break;
      case 'image':
        question.image = new OfferRequestImageQuestionDto().fromFirebase(
          firebase,
        );
        break;
      case 'list':
        question.list = new OfferRequestListPickerDto().fromFirebase(firebase);
        break;
      case 'number':
        question.number = new OfferRequestNumberQuestionDto().fromFirebase(
          firebase,
        );
        break;
      case 'number_input':
        question.numberInput =
          new OfferRequestNumberInputQuestionDto().fromFirebase(firebase);
        break;
      case 'radio':
        question.radio = new OfferRequestRadioQuestionDto().fromFirebase(
          firebase,
        );
        break;
      case 'textarea':
        question.textarea = new OfferRequestTextAreaQuestionDto().fromFirebase(
          firebase,
        );
        break;
      default:
        throw new Error('Unknown type');
    }

    return question;
  }
}

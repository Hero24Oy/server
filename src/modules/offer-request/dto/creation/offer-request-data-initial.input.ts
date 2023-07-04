import { Field, InputType, Float } from '@nestjs/graphql';
import { AddressesAnswered, OfferRequestDB } from 'hero24-types';
import { AddressesAnsweredInput } from './addresses-answered.input';
import { PackageInput, PackageShape } from './package.input';
import { FirebaseGraphQLAdapter } from 'src/modules/firebase/firebase.interfaces';
import { MaybeType, TypeSafeRequired } from 'src/modules/common/common.types';
import { QUESTION_FLAT_ID_NAME } from '../../offer-request.constants';
import {
  OfferRequestQuestionInput,
  OfferRequestQuestionInputShape,
} from '../offer-request-question/offer-request-question.input';
import { offerRequestQuestionsToTree } from '../../offer-request.utils/offer-request-questions-to-tree.util';

export type OfferRequestInitialDataInputShape = {
  buyerProfile: string;
  category: string;
  questions: OfferRequestQuestionInputShape[];
  addresses: AddressesAnsweredInput;
  package?: MaybeType<PackageShape>;
  prePayWith?: MaybeType<'stripe' | 'netvisor'>;
  sendInvoiceWith?: MaybeType<'sms' | 'email'>;
  prepaid?: MaybeType<'waiting' | 'paid'>;
  postpaid?: MaybeType<'no' | 'yes'>;
  fixedPrice?: MaybeType<number>;
  fixedDuration?: MaybeType<number>;
  promotionDisabled?: MaybeType<boolean>;
};

type OfferRequestInitialDataShape = {
  buyerProfile: string;
  category: string;
  questions: OfferRequestQuestionInput[];
  addresses: AddressesAnsweredInput;
  package?: MaybeType<PackageInput>;
  prePayWith?: MaybeType<'stripe' | 'netvisor'>;
  sendInvoiceWith?: MaybeType<'sms' | 'email'>;
  prepaid?: MaybeType<'waiting' | 'paid'>;
  postpaid?: MaybeType<'no' | 'yes'>;
  fixedPrice?: MaybeType<number>;
  fixedDuration?: MaybeType<number>;
  promotionDisabled?: MaybeType<boolean>;
};

type OfferRequestInitialDataDB = OfferRequestDB['data']['initial'];

@InputType()
export class OfferRequestDataInitialInput extends FirebaseGraphQLAdapter<
  OfferRequestInitialDataShape,
  OfferRequestInitialDataDB
> {
  constructor(shape?: OfferRequestInitialDataInputShape) {
    super(
      shape && {
        ...shape,
        package: shape.package && new PackageInput(shape.package),
        questions: shape.questions.map(
          (question) => new OfferRequestQuestionInput(question),
        ),
      },
    );
  }

  @Field(() => String)
  buyerProfile: string;

  @Field(() => String)
  category: string;

  @Field(() => [OfferRequestQuestionInput])
  questions: OfferRequestQuestionInput[];

  @Field(() => AddressesAnsweredInput)
  addresses: AddressesAnsweredInput;

  @Field(() => PackageInput, { nullable: true })
  package?: MaybeType<PackageInput>;

  @Field(() => String, { nullable: true })
  prePayWith?: MaybeType<'stripe' | 'netvisor'>;

  @Field(() => String, { nullable: true })
  sendInvoiceWith?: MaybeType<'sms' | 'email'>;

  @Field(() => String, { nullable: true })
  prepaid?: MaybeType<'waiting' | 'paid'>;

  @Field(() => String, { nullable: true })
  postpaid?: MaybeType<'no' | 'yes'>;

  @Field(() => Float, { nullable: true })
  fixedPrice?: MaybeType<number>;

  @Field(() => Float, { nullable: true })
  fixedDuration?: MaybeType<number>;

  @Field(() => Boolean, { nullable: true })
  promotionDisabled?: MaybeType<boolean>;

  protected toFirebaseType(): TypeSafeRequired<OfferRequestInitialDataDB> {
    const questions = this.questions.map((question) => question.toFirebase());

    return {
      buyerProfile: this.buyerProfile,
      category: this.category,
      prePayWith: this.prePayWith ?? undefined,
      sendInvoiceWith: this.sendInvoiceWith ?? undefined,
      prepaid: this.prepaid ?? undefined,
      postpaid: this.postpaid ?? undefined,
      fixedPrice: this.fixedPrice ?? undefined,
      fixedDuration: this.fixedDuration ?? undefined,
      promotionDisabled: this.promotionDisabled ?? undefined,
      questions: offerRequestQuestionsToTree(questions, QUESTION_FLAT_ID_NAME),
      addresses: (this.addresses.basic ||
        this.addresses.delivery) as AddressesAnswered,
      package: this.package
        ? {
            ...this.package.toFirebase(),
            id: this.package.id,
          }
        : undefined,
      createdAt: Date.now(),
    };
  }

  protected fromFirebaseType(): TypeSafeRequired<OfferRequestInitialDataShape> {
    throw new Error('Should never use');
  }
}

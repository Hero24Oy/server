import { Field, InputType } from '@nestjs/graphql';
import {
  AddressesAnswered,
  OfferRequestDB,
  OfferRequestQuestion,
} from 'hero24-types';
import { AddressesAnsweredInput } from './addresses-answered.input';
import {
  OfferRequestQuestionInput,
  offerRequestQuestionInputConvertor,
} from './offer-request-question/offer-request-question.input';
import { PackageInput } from './package.input';

@InputType()
export class OfferRequestDataInitialInput {
  @Field(() => String)
  buyerProfile: string;

  @Field(() => String)
  category: string;

  @Field(() => [OfferRequestQuestionInput])
  questions: OfferRequestQuestionInput[];

  @Field(() => AddressesAnsweredInput)
  addresses: AddressesAnsweredInput;

  @Field(() => PackageInput, { nullable: true })
  package?: PackageInput;

  @Field(() => String, { nullable: true })
  prePayWith?: 'stripe' | 'netvisor';

  @Field(() => String, { nullable: true })
  prepaid?: 'waiting' | 'paid';

  @Field(() => String, { nullable: true })
  fixedPrice?: number;

  @Field(() => String, { nullable: true })
  fixedDuration?: number;

  static convertFromFirebaseType(
    data: OfferRequestDB['data']['initial'],
  ): OfferRequestDataInitialInput {
    const depsQuestions: OfferRequestQuestionInput[] = [];

    const saveQuestion = (question: OfferRequestQuestion) => {
      const depsId = Math.random().toString(32);

      depsQuestions.push({
        ...offerRequestQuestionInputConvertor.convertFromFirebaseType(
          question,
          saveQuestion,
        ),
        depsId,
      });

      return depsId;
    };

    const baseQuestions = data.questions.map((question) =>
      offerRequestQuestionInputConvertor.convertFromFirebaseType(
        question,
        saveQuestion,
      ),
    );

    return {
      ...data,
      questions: [...baseQuestions, ...depsQuestions],
      addresses:
        data.addresses.type === 'basic'
          ? {
              basic: data.addresses,
            }
          : {
              delivery: data.addresses,
            },
    };
  }

  static convertToFirebaseType(
    data: OfferRequestDataInitialInput,
  ): Omit<OfferRequestDB['data']['initial'], 'createdAt'> {
    const mainQuestions = data.questions.filter(
      (question) => typeof question.depsId !== 'number',
    );

    return {
      ...data,
      questions: mainQuestions.map((question) =>
        offerRequestQuestionInputConvertor.convertToFirebaseType(
          question,
          data.questions,
        ),
      ),
      addresses: (data.addresses.basic ||
        data.addresses.delivery) as AddressesAnswered,
    };
  }
}

import { Field, InputType, Int } from '@nestjs/graphql';
import { serverTimestamp } from 'firebase/database';
import { AddressesAnswered, OfferRequestDB } from 'hero24-types';
import { omitUndefined } from 'src/modules/common/common.utils';
import { AddressesAnsweredInput } from './addresses-answered.input';
import { OfferRequestQuestionInput } from './offer-request-question/offer-request-question.input';
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
  sendInvoiceWith?: 'sms' | 'email';

  @Field(() => String, { nullable: true })
  prepaid?: 'waiting' | 'paid';

  @Field(() => String, { nullable: true })
  postpaid?: 'no' | 'yes';

  @Field(() => Int, { nullable: true })
  fixedPrice?: number;

  @Field(() => Int, { nullable: true })
  fixedDuration?: number;

  static convertToFirebaseType(
    data: OfferRequestDataInitialInput,
  ): OfferRequestDB['data']['initial'] {
    const mainQuestions = data.questions.filter(
      (question) => typeof question.depsId !== 'number',
    );

    return omitUndefined({
      ...data,
      questions: mainQuestions.map((question) =>
        OfferRequestQuestionInput.convertToFirebaseType(
          question,
          data.questions,
        ),
      ),
      addresses: (data.addresses.basic ||
        data.addresses.delivery) as AddressesAnswered,
      package: data.package && {
        ...PackageInput.convertToFirebaseType(data.package),
        id: data.package.id,
      },
      createdAt: serverTimestamp() as unknown as number,
    });
  }
}

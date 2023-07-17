import { Field, InputType, OmitType } from '@nestjs/graphql';
import { AddressesAnswered, OfferRequestDB } from 'hero24-types';
import { AddressesAnsweredInput } from './addresses-answered.input';
import { OfferRequestQuestionInput } from '../offer-request-question/offer-request-question.input';
import { offerRequestQuestionsToTree } from '../../offer-request.utils/offer-request-questions-to-tree.util';
import { OfferRequestDataInitialDto } from '../offer-request/offer-request-data-initial.dto';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';
import { PackageDto } from '../offer-request/package.dto';
import { PlainOfferRequestQuestion } from '../../offer-request-questions.types';

type OfferRequestInitialDataDB = OfferRequestDB['data']['initial'];

@InputType()
export class OfferRequestDataInitialInput extends OmitType(
  OfferRequestDataInitialDto,
  ['createdAt', 'questions', 'addresses'],
  InputType,
) {
  @Field(() => [OfferRequestQuestionInput])
  questions: OfferRequestQuestionInput[];

  @Field(() => AddressesAnsweredInput)
  addresses: AddressesAnsweredInput;

  static adapter: FirebaseAdapter<
    OfferRequestInitialDataDB,
    OfferRequestDataInitialInput
  >;
}

OfferRequestDataInitialInput.adapter = new FirebaseAdapter({
  toInternal(external) {
    const questions = external.questions.map((question) =>
      OfferRequestQuestionInput.adapter.toInternal(question),
    ) as PlainOfferRequestQuestion[];

    return {
      buyerProfile: external.buyerProfile,
      category: external.category,
      prePayWith: external.prePayWith ?? undefined,
      sendInvoiceWith: external.sendInvoiceWith ?? undefined,
      prepaid: external.prepaid ?? undefined,
      postpaid: external.postpaid ?? undefined,
      fixedPrice: external.fixedPrice ?? undefined,
      fixedDuration: external.fixedDuration ?? undefined,
      promotionDisabled: external.promotionDisabled ?? undefined,
      questions: offerRequestQuestionsToTree(questions),
      addresses: (external.addresses.basic ||
        external.addresses.delivery) as AddressesAnswered,
      package: external.package
        ? PackageDto.adapter.toInternal(external.package)
        : undefined,
      createdAt: Date.now(),
    };
  },
  toExternal() {
    throw new Error('Should never use');
  },
});

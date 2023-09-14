import { Field, InputType, OmitType } from '@nestjs/graphql';
import { AddressesAnswered, OfferRequestDB } from 'hero24-types';
import { map } from 'lodash';

import { OfferRequestQuestionInput } from '../../offer-request-question/dto/offer-request-question/offer-request-question.input';
import { PlainOfferRequestQuestion } from '../../offer-request-question/offer-request-question.types';
import { offerRequestQuestionsToArray } from '../../offer-request-question/offer-request-question.utils/offer-request-questions-to-array.util';
import { offerRequestQuestionsToTree } from '../../offer-request-question/offer-request-question.utils/offer-request-questions-to-tree.util';
import { AddressesAnsweredInput } from '../address-answered/addresses-answered.input';
import { OfferRequestDataInitialDto } from '../offer-request/offer-request-data-initial.dto';
import { PackageDto } from '../offer-request/package.dto';

import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

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
      addresses: AddressesAnsweredInput.adapter.toInternal(
        external.addresses,
      ) as AddressesAnswered,
      package: external.package
        ? PackageDto.adapter.toInternal(external.package)
        : undefined,
      createdAt: Date.now(),
    };
  },
  toExternal(internal) {
    const questions = map(
      offerRequestQuestionsToArray(internal.questions),
      OfferRequestQuestionInput.adapter.toExternal,
    );

    return {
      questions,
      buyerProfile: internal.buyerProfile,
      category: internal.category,
      prePayWith: internal.prePayWith ?? undefined,
      sendInvoiceWith: internal.sendInvoiceWith ?? undefined,
      prepaid: internal.prepaid ?? undefined,
      postpaid: internal.postpaid ?? undefined,
      fixedPrice: internal.fixedPrice ?? undefined,
      fixedDuration: internal.fixedDuration ?? undefined,
      promotionDisabled: internal.promotionDisabled ?? undefined,
      addresses: AddressesAnsweredInput.adapter.toExternal(internal.addresses),
      package: internal.package
        ? PackageDto.adapter.toExternal(internal.package)
        : undefined,
      createdAt: new Date(),
    };
  },
});

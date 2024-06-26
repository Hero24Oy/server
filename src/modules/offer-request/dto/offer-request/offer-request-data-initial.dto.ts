import { Field, Float, ObjectType } from '@nestjs/graphql';
import { AddressesAnswered, OfferRequestDB, PaidStatus } from 'hero24-types';

import {
  OfferRequestQuestionAdapter,
  OfferRequestQuestionDto,
} from '../../offer-request-question/dto/offer-request-question/offer-request-question.dto';
import { PlainOfferRequestQuestion } from '../../offer-request-question/offer-request-question.types';
import { offerRequestQuestionsToArray } from '../../offer-request-question/offer-request-question.utils/offer-request-questions-to-array.util';
import { offerRequestQuestionsToTree } from '../../offer-request-question/offer-request-question.utils/offer-request-questions-to-tree.util';
import {
  AddressesAnsweredAdapter,
  AddressesAnsweredDto,
} from '../address-answered/addresses-answered.dto';

import { PackageDto } from './package.dto';

import { MaybeType } from '$modules/common/common.types';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

type OfferRequestDataInitialDB = OfferRequestDB['data']['initial'];

@ObjectType()
export class OfferRequestDataInitialDto {
  @Field(() => String)
  buyerProfile: string;

  @Field(() => Float, { nullable: true })
  fixedDuration?: MaybeType<number>;

  @Field(() => Float, { nullable: true })
  fixedPrice?: MaybeType<number>;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => String, { nullable: true })
  platformProvider?: MaybeType<
    'hero_payments_oy' | 'hero24_oy' | 'hero24_b2b_oy'
  >;

  @Field(() => String, { nullable: true })
  prePayWith?: MaybeType<'stripe' | 'netvisor'>;

  @Field(() => String, { nullable: true })
  sendInvoiceWith?: MaybeType<'sms' | 'email'>;

  @Field(() => String, { nullable: true })
  prepaid?: MaybeType<PaidStatus>;

  @Field(() => String, { nullable: true })
  postpaid?: MaybeType<'no' | 'yes'>;

  @Field(() => [OfferRequestQuestionDto])
  questions: OfferRequestQuestionDto[];

  @Field(() => AddressesAnsweredDto)
  addresses: AddressesAnsweredDto;

  @Field(() => String)
  category: string;

  @Field(() => PackageDto, { nullable: true })
  package?: MaybeType<PackageDto>;

  @Field(() => Boolean, { nullable: true })
  promotionDisabled?: MaybeType<boolean>;

  static adapter: FirebaseAdapter<
    OfferRequestDataInitialDB,
    OfferRequestDataInitialDto
  >;
}

OfferRequestDataInitialDto.adapter = new FirebaseAdapter({
  toInternal(external) {
    const questions = external.questions.map((question) =>
      OfferRequestQuestionAdapter.toInternal(question),
    );

    return {
      prepaid: external.prepaid ?? undefined,
      postpaid: external.postpaid ?? undefined,
      promotionDisabled: external.promotionDisabled ?? undefined,
      fixedDuration: external.fixedDuration ?? undefined,
      fixedPrice: external.fixedPrice ?? undefined,
      platformProvider: external.platformProvider ?? undefined,
      prePayWith: external.prePayWith ?? undefined,
      sendInvoiceWith: external.sendInvoiceWith ?? undefined,
      buyerProfile: external.buyerProfile,
      addresses: AddressesAnsweredAdapter.toInternal(
        external.addresses,
      ) as AddressesAnswered,
      category: external.category,
      createdAt: Number(external.createdAt),
      package: external.package
        ? PackageDto.adapter.toInternal(external.package)
        : undefined,
      questions: offerRequestQuestionsToTree(
        questions as PlainOfferRequestQuestion[],
      ),
    };
  },
  toExternal(internal) {
    const questions = offerRequestQuestionsToArray(internal.questions);

    return {
      fixedPrice: internal.fixedPrice,
      platformProvider: internal.platformProvider,
      prePayWith: internal.prePayWith,
      sendInvoiceWith: internal.sendInvoiceWith,
      prepaid: internal.prepaid,
      postpaid: internal.postpaid,
      promotionDisabled: internal.promotionDisabled,
      buyerProfile: internal.buyerProfile,
      category: internal.category,
      fixedDuration: internal.fixedDuration,
      createdAt: new Date(internal.createdAt),
      questions: questions.map(
        (question) =>
          OfferRequestQuestionAdapter.toExternal(
            question,
          ) as OfferRequestQuestionDto,
      ),
      addresses: AddressesAnsweredAdapter.toExternal(
        internal.addresses,
      ) as AddressesAnsweredDto,
      package: internal.package
        ? PackageDto.adapter.toExternal(internal.package)
        : undefined,
    };
  },
});

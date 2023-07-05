import { Field, Float, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB } from 'hero24-types';

import { AddressesAnsweredDto } from './addresses-answered.dto';
import {
  OfferRequestQuestionDto,
  createOfferRequestQuestionDto,
} from '../offer-request-question/offer-request-question.dto';
import { PackageDto } from './package.dto';
import { FirebaseGraphQLAdapter } from 'src/modules/firebase/firebase.interfaces';
import { MaybeType, TypeSafeRequired } from 'src/modules/common/common.types';
import { BasicAddressesDto } from './basic-addresses.dto';
import { DeliveryAddressesDto } from './delivery-addresses.dto';
import { offerRequestQuestionsToTree } from '../../offer-request.utils/offer-request-questions-to-tree.util';
import { offerRequestQuestionsToArray } from '../../offer-request.utils/offer-request-questions-to-array.util';
import { QUESTION_FLAT_ID_NAME } from '../../offer-request.constants';

interface OfferRequestDataInitialShape {
  buyerProfile: string;
  fixedDuration?: MaybeType<number>;
  fixedPrice?: MaybeType<number>;
  createdAt: Date;
  prePayWith?: MaybeType<'stripe' | 'netvisor'>;
  sendInvoiceWith?: MaybeType<'sms' | 'email'>;
  prepaid?: MaybeType<'waiting' | 'paid'>;
  postpaid?: MaybeType<'no' | 'yes'>;
  questions: OfferRequestQuestionDto[];
  addresses: AddressesAnsweredDto;
  category: string;
  package?: MaybeType<PackageDto>;
  promotionDisabled?: MaybeType<boolean>;
}

type OfferRequestDataInitialDB = OfferRequestDB['data']['initial'];

@ObjectType()
export class OfferRequestDataInitialDto
  extends FirebaseGraphQLAdapter<
    OfferRequestDataInitialShape,
    OfferRequestDataInitialDB
  >
  implements OfferRequestDataInitialShape
{
  @Field(() => String)
  buyerProfile: string;

  @Field(() => Float, { nullable: true })
  fixedDuration?: MaybeType<number>;

  @Field(() => Float, { nullable: true })
  fixedPrice?: MaybeType<number>;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => String, { nullable: true })
  prePayWith?: MaybeType<'stripe' | 'netvisor'>;

  @Field(() => String, { nullable: true })
  sendInvoiceWith?: MaybeType<'sms' | 'email'>;

  @Field(() => String, { nullable: true })
  prepaid?: MaybeType<'waiting' | 'paid'>;

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

  protected toFirebaseType(): TypeSafeRequired<OfferRequestDataInitialDB> {
    const questions = this.questions.map((question) => question.toFirebase());

    return {
      prepaid: this.prepaid ?? undefined,
      postpaid: this.postpaid ?? undefined,
      promotionDisabled: this.promotionDisabled ?? undefined,
      fixedDuration: this.fixedDuration ?? undefined,
      fixedPrice: this.fixedPrice ?? undefined,
      prePayWith: this.prePayWith ?? undefined,
      sendInvoiceWith: this.sendInvoiceWith ?? undefined,
      buyerProfile: this.buyerProfile,
      addresses: this.addresses,
      category: this.category,
      createdAt: +new Date(this.createdAt),
      package: this.package
        ? {
            ...this.package.toFirebase(),
            id: this.package.id,
          }
        : undefined,
      questions: offerRequestQuestionsToTree(questions, QUESTION_FLAT_ID_NAME),
    };
  }

  protected fromFirebaseType(
    data: OfferRequestDataInitialDB,
  ): TypeSafeRequired<OfferRequestDataInitialShape> {
    const questions = offerRequestQuestionsToArray(
      data.questions,
      QUESTION_FLAT_ID_NAME,
    );

    return {
      fixedPrice: data.fixedPrice,
      prePayWith: data.prePayWith,
      sendInvoiceWith: data.sendInvoiceWith,
      prepaid: data.prepaid,
      postpaid: data.postpaid,
      promotionDisabled: data.promotionDisabled,
      buyerProfile: data.buyerProfile,
      category: data.category,
      fixedDuration: data.fixedDuration,
      createdAt: new Date(data.createdAt),
      questions: questions.map(createOfferRequestQuestionDto),
      addresses:
        data.addresses.type === 'basic'
          ? new BasicAddressesDto(data.addresses)
          : new DeliveryAddressesDto(data.addresses),
      package: data.package
        ? new PackageDto().fromFirebase(data.package)
        : undefined,
    };
  }
}

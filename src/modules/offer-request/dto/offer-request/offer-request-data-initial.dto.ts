import { Field, Float, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB, OfferRequestQuestion } from 'hero24-types';

import {
  AddressesAnsweredDto,
  BasicAddressesDto,
  DeliveryAddressesDto,
} from './addresses-answered.dto';
import {
  OfferRequestQuestionDto,
  offerRequestQuestionDtoConvertor,
} from '../offer-request-question/offer-request-question.dto';
import { PackageDto } from './package.dto';
import { FirebaseGraphQLAdapter } from 'src/modules/firebase/firebase.interfaces';
import { TypeSafeRequired } from 'src/modules/common/common.types';

interface OfferRequestDataInitialShape {
  buyerProfile: string;
  fixedDuration?: number;
  fixedPrice?: number;
  createdAt: Date;
  prePayWith?: 'stripe' | 'netvisor';
  sendInvoiceWith?: 'sms' | 'email';
  prepaid?: 'waiting' | 'paid';
  postpaid?: 'no' | 'yes';
  questions: OfferRequestQuestionDto[];
  addresses: AddressesAnsweredDto;
  category: string;
  package?: PackageDto;
  promotionDisabled?: boolean;
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
  fixedDuration?: number;

  @Field(() => Float, { nullable: true })
  fixedPrice?: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => String, { nullable: true })
  prePayWith?: 'stripe' | 'netvisor';

  @Field(() => String, { nullable: true })
  sendInvoiceWith?: 'sms' | 'email';

  @Field(() => String, { nullable: true })
  prepaid?: 'waiting' | 'paid';

  @Field(() => String, { nullable: true })
  postpaid?: 'no' | 'yes';

  @Field(() => [OfferRequestQuestionDto])
  questions: OfferRequestQuestionDto[];

  @Field(() => AddressesAnsweredDto)
  addresses: AddressesAnsweredDto;

  @Field(() => String)
  category: string;

  @Field(() => PackageDto, { nullable: true })
  package?: PackageDto;

  @Field(() => Boolean, { nullable: true })
  promotionDisabled?: boolean;

  protected toFirebaseType(): TypeSafeRequired<OfferRequestDataInitialDB> {
    const baseQuestions = this.questions.filter(
      ({ depsId }) => typeof depsId !== 'string',
    );

    const depsQuestions = this.questions.filter(
      ({ depsId }) => typeof depsId === 'string',
    );

    return {
      prepaid: this.prepaid,
      postpaid: this.postpaid,
      promotionDisabled: this.promotionDisabled,
      fixedDuration: this.fixedDuration,
      fixedPrice: this.fixedPrice,
      prePayWith: this.prePayWith,
      sendInvoiceWith: this.sendInvoiceWith,
      buyerProfile: this.buyerProfile,
      addresses: this.addresses,
      category: this.category,
      createdAt: +new Date(this.createdAt),
      package: this.package
        ? {
            ...PackageDto.convertToFirebaseType(this.package),
            id: this.package.id,
          }
        : undefined,
      questions: baseQuestions.map((question) =>
        offerRequestQuestionDtoConvertor.convertToFirebaseType(
          question,
          depsQuestions,
        ),
      ),
    };
  }

  protected fromFirebaseType(
    data: OfferRequestDataInitialDB,
  ): TypeSafeRequired<OfferRequestDataInitialShape> {
    const depsQuestions: OfferRequestQuestionDto[] = [];

    const saveQuestion = (question: OfferRequestQuestion) => {
      const depsId = Math.random().toString(32);

      const questionDto =
        offerRequestQuestionDtoConvertor.convertFromFirebaseType(
          question,
          saveQuestion,
        );

      depsQuestions.push({ ...questionDto, depsId });

      return depsId;
    };

    const baseQuestions = data.questions.map((question) =>
      offerRequestQuestionDtoConvertor.convertFromFirebaseType(
        question,
        saveQuestion,
      ),
    );

    return {
      fixedPrice: this.fixedPrice,
      prePayWith: this.prePayWith,
      sendInvoiceWith: this.sendInvoiceWith,
      prepaid: this.prepaid,
      postpaid: this.postpaid,
      promotionDisabled: this.promotionDisabled,
      buyerProfile: this.buyerProfile,
      category: this.category,
      fixedDuration: data.fixedDuration,
      createdAt: new Date(data.createdAt),
      questions: [...baseQuestions, ...depsQuestions],
      addresses:
        data.addresses.type === 'basic'
          ? new BasicAddressesDto(data.addresses)
          : new DeliveryAddressesDto(data.addresses),
      package: data.package
        ? PackageDto.convertFromFirebaseType(data.package, data.package.id)
        : undefined,
    };
  }
}

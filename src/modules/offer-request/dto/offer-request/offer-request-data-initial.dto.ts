import { Field, Float, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB, OfferRequestQuestion } from 'hero24-types';

import { omitUndefined } from 'src/modules/common/common.utils';

import {
  AddressesAnsweredDto,
  BasicAddressesDto,
  DeliveryAddressesDto,
} from './addresses-answered.dto';
import {
  OfferRequestQuestionDto,
  offerRequestQuestionDtoConvertor,
} from '../offer-request-question/offer-request-question.dto';
import { PackageDto } from 'src/modules/common/dto/package/package.dto';

@ObjectType()
export class OfferRequestDataInitialDto {
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

  static convertFromFirebaseType(
    data: OfferRequestDB['data']['initial'],
  ): OfferRequestDataInitialDto {
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
      ...data,
      createdAt: new Date(data.createdAt),
      questions: [...baseQuestions, ...depsQuestions],
      addresses:
        data.addresses.type === 'basic'
          ? new BasicAddressesDto(data.addresses)
          : new DeliveryAddressesDto(data.addresses),
      ...(data.package
        ? {
            package: PackageDto.convertFromFirebaseType(
              data.package,
              data.package.id,
            ),
          }
        : {}),
    };
  }

  static convertToFirebaseType(
    data: OfferRequestDataInitialDto,
  ): OfferRequestDB['data']['initial'] {
    const baseQuestions = data.questions.filter(
      ({ depsId }) => typeof depsId !== 'string',
    );

    const depsQuestions = data.questions.filter(
      ({ depsId }) => typeof depsId === 'string',
    );

    return omitUndefined({
      ...data,
      createdAt: +new Date(data.createdAt),
      ...(data.package
        ? {
            package: {
              ...PackageDto.convertToFirebaseType(data.package),
              id: data.package.id,
            },
          }
        : {}),
      questions: baseQuestions.map((question) =>
        offerRequestQuestionDtoConvertor.convertToFirebaseType(
          question,
          depsQuestions,
        ),
      ),
    });
  }
}

import { Field, Int, ObjectType } from '@nestjs/graphql';
import { OfferRequestQuestion, OfferRequestQuestionOption } from 'hero24-types';
import { MaybeType } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import {
  OfferRequestQuestionDto,
  offerRequestQuestionDtoConvertor,
} from './offer-request-question.dto';

@ObjectType()
export class OfferRequestQuestionOptionDto {
  @Field(() => String)
  id: string;

  @Field(() => TranslationFieldDto, { nullable: true })
  name?: MaybeType<TranslationFieldDto>;

  @Field(() => Int, { nullable: true })
  order?: MaybeType<number>;

  @Field(() => [String], { nullable: true })
  questions?: MaybeType<string[]>; // it will be used to tackle circular deps in graphql. This is custom ID, generated on the go.

  @Field(() => Boolean, { nullable: true })
  checked?: MaybeType<boolean>;

  static convertToFirebaseType(
    data: OfferRequestQuestionOptionDto,
    plainQuestions: OfferRequestQuestionDto[],
  ): OfferRequestQuestionOption {
    return {
      ...data,
      name: data.name || null,
      order: data.order || null,
      questions:
        data.questions?.map((depsId) =>
          offerRequestQuestionDtoConvertor.convertToFirebaseType(
            plainQuestions.find(
              (question) => depsId === question.depsId,
            ) as OfferRequestQuestionDto,
            plainQuestions,
          ),
        ) || null,
      checked: data.checked || null,
    };
  }

  static convertFromFirebaseType(
    data: OfferRequestQuestionOption,
    saveQuestion: (question: OfferRequestQuestion) => string, // return the depsId
  ): OfferRequestQuestionOptionDto {
    return {
      ...data,
      questions: data.questions?.map(saveQuestion),
    };
  }
}

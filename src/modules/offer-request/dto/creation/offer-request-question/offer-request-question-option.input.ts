import { Field, Int, InputType } from '@nestjs/graphql';
import { OfferRequestQuestion, OfferRequestQuestionOption } from 'hero24-types';

import { MaybeType } from 'src/modules/common/common.types';
import { TranslationFieldInput } from 'src/modules/common/dto/translation-field.input';
import { OfferRequestQuestionInput } from './offer-request-question.input';

@InputType()
export class OfferRequestQuestionOptionInput {
  @Field(() => String)
  id: string;

  @Field(() => TranslationFieldInput, { nullable: true })
  name?: MaybeType<TranslationFieldInput>;

  @Field(() => Int, { nullable: true })
  order?: MaybeType<number>;

  @Field(() => [String], { nullable: true })
  questions?: MaybeType<string[]>; // it will be used to tackle circular deps in graphql. This is custom ID, generated on the go.

  @Field(() => Boolean, { nullable: true })
  checked?: MaybeType<boolean>;

  static convertToFirebaseType(
    data: OfferRequestQuestionOptionInput,
    plainQuestions: OfferRequestQuestionInput[],
  ): OfferRequestQuestionOption {
    return {
      ...data,
      name: data.name || null,
      order: data.order || null,
      questions:
        data.questions?.map((depsId) =>
          OfferRequestQuestionInput.convertToFirebaseType(
            plainQuestions.find(
              (question) => depsId === question.depsId,
            ) as OfferRequestQuestionInput,
            plainQuestions,
          ),
        ) || null,
      checked: data.checked || null,
    };
  }

  static convertFromFirebaseType(
    data: OfferRequestQuestionOption,
    saveQuestion: (question: OfferRequestQuestion) => string, // return the depsId
  ): OfferRequestQuestionOptionInput {
    return {
      ...data,
      questions: data.questions?.map(saveQuestion),
    };
  }
}

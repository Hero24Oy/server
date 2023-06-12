import { Field, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB, OfferRequestQuestion } from 'hero24-types';

import { omitUndefined } from 'src/modules/common/common.utils';

import {
  OfferRequestQuestionDto,
  offerRequestQuestionDtoConvertor,
} from '../offer-request-question/offer-request-question.dto';

@ObjectType()
export class OfferRequestDataRequestedChangesChangedQuestionsDto {
  @Field(() => [OfferRequestQuestionDto])
  before: OfferRequestQuestionDto[];

  @Field(() => [OfferRequestQuestionDto])
  after: OfferRequestQuestionDto[];

  static convertFromFirebaseType(
    data: Exclude<
      OfferRequestDB['data']['requestedChanges'],
      undefined
    >['changedQuestions'],
  ): OfferRequestDataRequestedChangesChangedQuestionsDto {
    const depsBeforeQuestions: OfferRequestQuestionDto[] = [];
    const depsAfterQuestions: OfferRequestQuestionDto[] = [];

    const saveBeforeQuestion = (question: OfferRequestQuestion) => {
      const depsId = Math.random().toString(32);

      const questionDto =
        offerRequestQuestionDtoConvertor.convertFromFirebaseType(
          question,
          saveBeforeQuestion,
        );

      depsBeforeQuestions.push({ ...questionDto, depsId });

      return depsId;
    };

    const saveAfterQuestion = (question: OfferRequestQuestion) => {
      const depsId = Math.random().toString(32);

      const questionDto =
        offerRequestQuestionDtoConvertor.convertFromFirebaseType(
          question,
          saveAfterQuestion,
        );

      depsAfterQuestions.push({ ...questionDto, depsId });

      return depsId;
    };

    const rootBeforeQuestions: OfferRequestQuestionDto[] = data.before.map(
      (question) =>
        offerRequestQuestionDtoConvertor.convertFromFirebaseType(
          question,
          saveBeforeQuestion,
        ),
    );
    const rootAfterQuestions: OfferRequestQuestionDto[] = data.after.map(
      (question) =>
        offerRequestQuestionDtoConvertor.convertFromFirebaseType(
          question,
          saveAfterQuestion,
        ),
    );

    return {
      before: [...rootBeforeQuestions, ...depsBeforeQuestions],
      after: [...rootAfterQuestions, ...depsAfterQuestions],
    };
  }

  static convertToFirebaseType(
    data: OfferRequestDataRequestedChangesChangedQuestionsDto,
  ): Exclude<
    OfferRequestDB['data']['requestedChanges'],
    undefined
  >['changedQuestions'] {
    const depsBeforeQuestion = data.before.filter(
      ({ depsId }) => typeof depsId === 'number',
    );
    const depsAfterQuestions = data.after.filter(
      ({ depsId }) => typeof depsId === 'number',
    );

    const rootBeforeQuestion = data.before.filter(
      ({ depsId }) => typeof depsId !== 'number',
    );
    const rootAfterQuestions = data.after.filter(
      ({ depsId }) => typeof depsId !== 'number',
    );

    return omitUndefined({
      before: rootBeforeQuestion.map((question) =>
        offerRequestQuestionDtoConvertor.convertToFirebaseType(
          question,
          depsBeforeQuestion,
        ),
      ),
      after: rootAfterQuestions.map((question) =>
        offerRequestQuestionDtoConvertor.convertToFirebaseType(
          question,
          depsAfterQuestions,
        ),
      ),
    });
  }
}

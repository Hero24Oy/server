import { Field, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB, OfferRequestQuestion } from 'hero24-types';

import { omitUndefined } from 'src/modules/common/common.utils';

import {
  OfferRequestQuestionDto,
  offerRequestQuestionDtoConvertor,
} from '../offer-request-question/offer-request-question.dto';
import { FirebaseGraphQLAdapter } from 'src/modules/firebase/firebase.interfaces';
import { TypeSafeRequired } from 'src/modules/common/common.types';

type ChangedQuestionsShape = {
  before: OfferRequestQuestionDto[];
  after: OfferRequestQuestionDto[];
};

type ChangedQuestionsDB = Required<
  OfferRequestDB['data']
>['requestedChanges']['changedQuestions'];

@ObjectType()
export class OfferRequestDataRequestedChangesChangedQuestionsDto
  extends FirebaseGraphQLAdapter<ChangedQuestionsShape, ChangedQuestionsDB>
  implements ChangedQuestionsShape
{
  @Field(() => [OfferRequestQuestionDto])
  before: OfferRequestQuestionDto[];

  @Field(() => [OfferRequestQuestionDto])
  after: OfferRequestQuestionDto[];

  protected toFirebaseType(): TypeSafeRequired<ChangedQuestionsDB> {
    const depsBeforeQuestion = this.before.filter(
      ({ depsId }) => typeof depsId === 'string',
    );
    const depsAfterQuestions = this.after.filter(
      ({ depsId }) => typeof depsId === 'string',
    );

    const rootBeforeQuestion = this.before.filter(
      ({ depsId }) => typeof depsId !== 'string',
    );
    const rootAfterQuestions = this.after.filter(
      ({ depsId }) => typeof depsId !== 'string',
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

  protected fromFirebaseType(
    changedQuestions: ChangedQuestionsDB,
  ): TypeSafeRequired<ChangedQuestionsShape> {
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

    const rootBeforeQuestions: OfferRequestQuestionDto[] =
      changedQuestions.before.map((question) =>
        offerRequestQuestionDtoConvertor.convertFromFirebaseType(
          question,
          saveBeforeQuestion,
        ),
      );
    const rootAfterQuestions: OfferRequestQuestionDto[] =
      changedQuestions.after.map((question) =>
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
}

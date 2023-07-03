import { Field, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB } from 'hero24-types';

import { omitUndefined } from 'src/modules/common/common.utils';

import {
  OfferRequestQuestionDto,
  createOfferRequestQuestionDto,
} from '../offer-request-question/offer-request-question.dto';
import { FirebaseGraphQLAdapter } from 'src/modules/firebase/firebase.interfaces';
import { TypeSafeRequired } from 'src/modules/common/common.types';
import { offerRequestQuestionsToTree } from '../../offer-request.utils/offer-request-questions-to-tree.util';
import { offerRequestQuestionsToArray } from '../../offer-request.utils/offer-request-questions-to-array.util';
import { QUESTION_FLAT_ID_NAME } from '../../offer-request.constants';

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
    const before = offerRequestQuestionsToTree(
      this.before.map((question) => question.toFirebase()),
      QUESTION_FLAT_ID_NAME,
    );
    const after = offerRequestQuestionsToTree(
      this.after.map((question) => question.toFirebase()),
      QUESTION_FLAT_ID_NAME,
    );

    return omitUndefined({
      before,
      after,
    });
  }

  protected fromFirebaseType(
    changedQuestions: ChangedQuestionsDB,
  ): TypeSafeRequired<ChangedQuestionsShape> {
    const beforeQuestions = offerRequestQuestionsToArray(
      changedQuestions.before,
      QUESTION_FLAT_ID_NAME,
    );
    const afterQuestions = offerRequestQuestionsToArray(
      changedQuestions.after,
      QUESTION_FLAT_ID_NAME,
    );

    return {
      before: beforeQuestions.map(createOfferRequestQuestionDto),
      after: afterQuestions.map(createOfferRequestQuestionDto),
    };
  }
}

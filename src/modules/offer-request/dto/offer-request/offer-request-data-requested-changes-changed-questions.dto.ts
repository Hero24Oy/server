import { Field, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB } from 'hero24-types';

import { omitUndefined } from 'src/modules/common/common.utils';

import {
  OfferRequestQuestionDto,
  createOfferRequestQuestionDto,
} from '../offer-request-question/offer-request-question.dto';
import { offerRequestQuestionsToTree } from '../../offer-request.utils/offer-request-questions-to-tree.util';
import { offerRequestQuestionsToArray } from '../../offer-request.utils/offer-request-questions-to-array.util';
import { QUESTION_FLAT_ID_NAME } from '../../offer-request.constants';
import { FirebaseAdapter } from 'src/modules/firebase/firebase-adapter.interfaces';

type ChangedQuestionsDB = Required<
  OfferRequestDB['data']
>['requestedChanges']['changedQuestions'];

@ObjectType()
export class OfferRequestDataRequestedChangesChangedQuestionsDto {
  @Field(() => [OfferRequestQuestionDto])
  before: OfferRequestQuestionDto[];

  @Field(() => [OfferRequestQuestionDto])
  after: OfferRequestQuestionDto[];

  static adapter: FirebaseAdapter<
    ChangedQuestionsDB,
    OfferRequestDataRequestedChangesChangedQuestionsDto
  >;
}

OfferRequestDataRequestedChangesChangedQuestionsDto.adapter =
  new FirebaseAdapter({
    toInternal(external) {
      const before = offerRequestQuestionsToTree(
        external.before.map((question) => question.toFirebase()),
        QUESTION_FLAT_ID_NAME,
      );
      const after = offerRequestQuestionsToTree(
        external.after.map((question) => question.toFirebase()),
        QUESTION_FLAT_ID_NAME,
      );

      return omitUndefined({
        before,
        after,
      });
    },
    toExternal(internal) {
      const beforeQuestions = offerRequestQuestionsToArray(
        internal.before,
        QUESTION_FLAT_ID_NAME,
      );
      const afterQuestions = offerRequestQuestionsToArray(
        internal.after,
        QUESTION_FLAT_ID_NAME,
      );

      return {
        before: beforeQuestions.map(createOfferRequestQuestionDto),
        after: afterQuestions.map(createOfferRequestQuestionDto),
      };
    },
  });

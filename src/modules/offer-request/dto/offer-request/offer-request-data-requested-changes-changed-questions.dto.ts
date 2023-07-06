import { Field, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB } from 'hero24-types';

import { FirebaseAdapter } from 'src/modules/firebase/firebase-adapter.interfaces';

import {
  OfferRequestQuestionDto,
  offerRequestQuestionAdapter,
} from '../offer-request-question/offer-request-question.dto';
import { offerRequestQuestionsToTree } from '../../offer-request.utils/offer-request-questions-to-tree.util';
import { offerRequestQuestionsToArray } from '../../offer-request.utils/offer-request-questions-to-array.util';
import { PlainOfferRequestQuestion } from '../../offer-request-questions.types';

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
      const before = external.before.map(
        (question) =>
          offerRequestQuestionAdapter.toInternal(
            question,
          ) as PlainOfferRequestQuestion,
      );

      const after = external.after.map(
        (question) =>
          offerRequestQuestionAdapter.toInternal(
            question,
          ) as PlainOfferRequestQuestion,
      );

      return {
        before: offerRequestQuestionsToTree(before),
        after: offerRequestQuestionsToTree(after),
      };
    },
    toExternal(internal) {
      const beforeQuestions = offerRequestQuestionsToArray(internal.before);
      const afterQuestions = offerRequestQuestionsToArray(internal.after);

      return {
        before: beforeQuestions.map((question) =>
          offerRequestQuestionAdapter.toExternal(question),
        ) as OfferRequestQuestionDto[],
        after: afterQuestions.map((question) =>
          offerRequestQuestionAdapter.toExternal(question),
        ) as OfferRequestQuestionDto[],
      };
    },
  });

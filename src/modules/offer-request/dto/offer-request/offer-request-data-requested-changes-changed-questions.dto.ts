import { Field, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB } from 'hero24-types';

import {
  OfferRequestQuestionAdapter,
  OfferRequestQuestionDto,
} from '../../offer-request-question/dto/offer-request-question/offer-request-question.dto';
import { PlainOfferRequestQuestion } from '../../offer-request-question/offer-request-question.types';
import { offerRequestQuestionsToArray } from '../../offer-request-question/offer-request-question.utils/offer-request-questions-to-array.util';
import { offerRequestQuestionsToTree } from '../../offer-request-question/offer-request-question.utils/offer-request-questions-to-tree.util';

import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

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
          OfferRequestQuestionAdapter.toInternal(
            question,
          ) as PlainOfferRequestQuestion,
      );

      const after = external.after.map(
        (question) =>
          OfferRequestQuestionAdapter.toInternal(
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
          OfferRequestQuestionAdapter.toExternal(question),
        ) as OfferRequestQuestionDto[],
        after: afterQuestions.map((question) =>
          OfferRequestQuestionAdapter.toExternal(question),
        ) as OfferRequestQuestionDto[],
      };
    },
  });

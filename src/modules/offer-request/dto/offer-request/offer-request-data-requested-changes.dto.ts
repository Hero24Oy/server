import { Field, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB } from 'hero24-types';

import { OfferRequestDataRequestedChangesChangedQuestionsDto } from './offer-request-data-requested-changes-changed-questions.dto';

import { MaybeType } from '$modules/common/common.types';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

type RequestedChangesDB = Exclude<
  OfferRequestDB['data']['requestedChanges'],
  undefined
>;

@ObjectType()
export class OfferRequestDataRequestedChangesDto {
  @Field(() => Date)
  createdAt: Date;

  @Field(() => String, { nullable: true })
  reason?: MaybeType<string>;

  @Field(() => OfferRequestDataRequestedChangesChangedQuestionsDto)
  changedQuestions: OfferRequestDataRequestedChangesChangedQuestionsDto;

  static adapter: FirebaseAdapter<
    RequestedChangesDB,
    OfferRequestDataRequestedChangesDto
  >;
}

OfferRequestDataRequestedChangesDto.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    reason: external.reason ?? undefined,
    created: Number(external.createdAt),
    changedQuestions:
      OfferRequestDataRequestedChangesChangedQuestionsDto.adapter.toInternal(
        external.changedQuestions,
      ),
  }),
  toExternal: (internal) => ({
    reason: internal.reason,
    createdAt: new Date(internal.created),
    changedQuestions:
      OfferRequestDataRequestedChangesChangedQuestionsDto.adapter.toExternal(
        internal.changedQuestions,
      ),
  }),
});

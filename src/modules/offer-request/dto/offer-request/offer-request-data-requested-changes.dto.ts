import { Field, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB } from 'hero24-types';

import { MaybeType } from 'src/modules/common/common.types';

import { OfferRequestDataRequestedChangesChangedQuestionsDto } from './offer-request-data-requested-changes-changed-questions.dto';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

type RequestedChangesDB = Exclude<
  OfferRequestDB['data']['requestedChanges'],
  undefined
>;

@ObjectType()
export class OfferRequestDataRequestedChangesDto {
  @Field(() => Date)
  created: Date;

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
    created: Number(external.created),
    changedQuestions:
      OfferRequestDataRequestedChangesChangedQuestionsDto.adapter.toInternal(
        external.changedQuestions,
      ),
  }),
  toExternal: (internal) => ({
    reason: internal.reason,
    created: new Date(internal.created),
    changedQuestions:
      OfferRequestDataRequestedChangesChangedQuestionsDto.adapter.toExternal(
        internal.changedQuestions,
      ),
  }),
});

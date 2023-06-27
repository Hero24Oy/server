import { Field, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB } from 'hero24-types';

import { FirebaseGraphQLAdapter } from 'src/modules/firebase/firebase.interfaces';
import { TypeSafeRequired } from 'src/modules/common/common.types';

import { OfferRequestDataRequestedChangesChangedQuestionsDto } from './offer-request-data-requested-changes-changed-questions.dto';

type RequestedChangesShape = {
  created: Date;
  reason?: string;
  changedQuestions: OfferRequestDataRequestedChangesChangedQuestionsDto;
};

type RequestedChangesDB = Exclude<
  OfferRequestDB['data']['requestedChanges'],
  undefined
>;

@ObjectType()
export class OfferRequestDataRequestedChangesDto
  extends FirebaseGraphQLAdapter<RequestedChangesShape, RequestedChangesDB>
  implements RequestedChangesShape
{
  @Field(() => Date)
  created: Date;

  @Field(() => String, { nullable: true })
  reason?: string;

  @Field(() => OfferRequestDataRequestedChangesChangedQuestionsDto)
  changedQuestions: OfferRequestDataRequestedChangesChangedQuestionsDto;

  protected toFirebaseType(): TypeSafeRequired<RequestedChangesDB> {
    return {
      reason: this.reason,
      created: +new Date(this.created),
      changedQuestions: this.changedQuestions.toFirebase(),
    };
  }

  protected fromFirebaseType(
    requestedChanges: RequestedChangesDB,
  ): TypeSafeRequired<RequestedChangesShape> {
    return {
      reason: requestedChanges.reason,
      created: new Date(requestedChanges.created),
      changedQuestions:
        new OfferRequestDataRequestedChangesChangedQuestionsDto().fromFirebase(
          requestedChanges.changedQuestions,
        ),
    };
  }
}

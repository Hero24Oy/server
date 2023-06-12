import { Field, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB } from 'hero24-types';

import { omitUndefined } from 'src/modules/common/common.utils';

import { OfferRequestDataRequestedChangesChangedQuestionsDto } from './offer-request-data-requested-changes-changed-questions.dto';

@ObjectType()
export class OfferRequestDataRequestedChangesDto {
  @Field(() => Date)
  created: Date;

  @Field(() => String, { nullable: true })
  reason?: string;

  @Field(() => OfferRequestDataRequestedChangesChangedQuestionsDto)
  changedQuestions: OfferRequestDataRequestedChangesChangedQuestionsDto;

  static convertFromFirebaseType(
    data: Exclude<OfferRequestDB['data']['requestedChanges'], undefined>,
  ): OfferRequestDataRequestedChangesDto {
    return {
      created: new Date(data.created),
      changedQuestions:
        OfferRequestDataRequestedChangesChangedQuestionsDto.convertFromFirebaseType(
          data.changedQuestions,
        ),
    };
  }

  static convertToFirebaseType(
    data: OfferRequestDataRequestedChangesDto,
  ): Exclude<OfferRequestDB['data']['requestedChanges'], undefined> {
    return omitUndefined({
      created: +new Date(data.created),
      changedQuestions:
        OfferRequestDataRequestedChangesChangedQuestionsDto.convertToFirebaseType(
          data.changedQuestions,
        ),
    });
  }
}

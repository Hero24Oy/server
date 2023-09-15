import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

import { PlainOfferRequestQuestion } from '../../offer-request-question.types';

import { OfferRequestBaseQuestionDto } from './offer-request-base-question.dto';
import { OfferRequestQuestionType } from './offer-request-question-type.enum';

import { MaybeType } from '$modules/common/common.types';
import {
  convertFirebaseMapToList,
  convertListToFirebaseMap,
} from '$modules/common/common.utils';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

type QuestionType = typeof OfferRequestQuestionType.IMAGE;

type PlainOfferRequestImageQuestion = PlainOfferRequestQuestion & {
  type: QuestionType;
};

@ObjectType({ implements: () => OfferRequestBaseQuestionDto })
@InputType('OfferRequestImageQuestionInput')
export class OfferRequestImageQuestionDto extends OfferRequestBaseQuestionDto<QuestionType> {
  @Field(() => [String], { nullable: true })
  images?: MaybeType<string[]>;

  @Field(() => Int, { nullable: true })
  imageCount?: MaybeType<number>;

  static adapter: FirebaseAdapter<
    PlainOfferRequestImageQuestion,
    OfferRequestImageQuestionDto
  >;
}

OfferRequestImageQuestionDto.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    ...OfferRequestBaseQuestionDto.adapter.toInternal(external),
    type: OfferRequestQuestionType.IMAGE,
    images: external.images ? convertListToFirebaseMap(external.images) : null,
    imageCount: external.imageCount || 0,
  }),
  toExternal: (internal) => ({
    ...OfferRequestBaseQuestionDto.adapter.toExternal(internal),
    type: OfferRequestQuestionType.IMAGE,
    images: internal.images && convertFirebaseMapToList(internal.images),
    imageCount: internal.imageCount,
  }),
});

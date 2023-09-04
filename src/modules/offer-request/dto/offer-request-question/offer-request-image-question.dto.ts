import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

import { MaybeType } from 'src/modules/common/common.types';
import {
  convertFirebaseMapToList,
  convertListToFirebaseMap,
} from 'src/modules/common/common.utils';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

import { OfferRequestBaseQuestionDto } from './offer-request-base-question.dto';
import { PlainOfferRequestQuestion } from '../../offer-request-questions.types';
import { OfferRequestQuestionType } from '../../offer-request.constants';

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

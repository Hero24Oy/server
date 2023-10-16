import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

import { BaseQuestionObject } from './base';

import { QuestionType } from '$modules/category/enums';
import { PlainQuestion } from '$modules/category/types';
import { MaybeType } from '$modules/common/common.types';
import {
  convertFirebaseMapToList,
  convertListToFirebaseMap,
} from '$modules/common/common.utils';

type LocalPlainQuestion = PlainQuestion & {
  type: `${QuestionType.IMAGE}`;
};

@ObjectType({ implements: () => BaseQuestionObject })
export class ImageQuestionObject extends BaseQuestionObject {
  @Field(() => String)
  declare type: QuestionType;

  @Field(() => [String], { nullable: true })
  images?: MaybeType<string[]>;

  @Field(() => Int, { nullable: true })
  imageCount?: MaybeType<number>;

  declare static adapter: FirebaseAdapter<
    LocalPlainQuestion,
    ImageQuestionObject
  >;
}

ImageQuestionObject.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    depsId: external.depsId ?? undefined,
    ...BaseQuestionObject.adapter.toInternal(external),
    type: QuestionType.IMAGE as QuestionType.IMAGE,
    images: external.images ? convertListToFirebaseMap(external.images) : null,
    imageCount: external.imageCount ?? 0,
  }),
  toExternal: (internal) => ({
    ...BaseQuestionObject.adapter.toExternal(internal),
    type: QuestionType.IMAGE as QuestionType.IMAGE,
    images: internal.images && convertFirebaseMapToList(internal.images),
    imageCount: internal.imageCount,
  }),
});

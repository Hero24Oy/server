import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { BaseQuestionDto } from './base-question.dto';
import { PlainQuestion } from './question.types';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';
import { convertFirebaseMapToList, convertListToFirebaseMap } from '../../common.utils';

type QuestionType = 'image';

type PlainImageQuestion = PlainQuestion & {
  type: QuestionType;
};

@ObjectType({ implements: () => BaseQuestionDto })
@InputType('ImageQuestionInput')
export class ImageQuestionDto extends BaseQuestionDto {
  @Field(() => String)
  type: 'image';

  @Field(() => [String], { nullable: true })
  images?: MaybeType<string[]>;

  @Field(() => Int, { nullable: true })
  imageCount?: MaybeType<number>;

  static adapter: FirebaseAdapter<
    PlainImageQuestion,
    ImageQuestionDto
  >;
}

ImageQuestionDto.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    depsId: external.depsId,
    ...BaseQuestionDto.adapter.toInternal(external),
    type: 'image' as QuestionType,
    images: external.images ? convertListToFirebaseMap(external.images) : null,
    imageCount: external.imageCount || 0,
  }),
  toExternal: (internal) => ({
    ...BaseQuestionDto.adapter.toExternal(internal),
    type: 'image' as QuestionType,
    images: internal.images && convertFirebaseMapToList(internal.images),
    imageCount: internal.imageCount,
  }),
});

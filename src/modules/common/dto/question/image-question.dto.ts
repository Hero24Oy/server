import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { BaseQuestionDto } from './base-question.dto';

@ObjectType()
export class ImageQuestionDto extends BaseQuestionDto {
  @Field(() => String)
  type: 'image';

  @Field(() => [String], { nullable: true })
  images?: MaybeType<string[]>;

  @Field(() => Int, { nullable: true })
  imageCount?: MaybeType<number>;
}

import { Field, ObjectType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { BaseQuestionDto } from './base-question.dto';
import { QuestionOptionDto } from './question-option.dto';

@ObjectType()
export class RadioQuestionDto extends BaseQuestionDto {
  @Field(() => String)
  type: 'radio';

  @Field(() => String, { nullable: true })
  selectedOption?: MaybeType<string>;

  @Field(() => [QuestionOptionDto])
  options: QuestionOptionDto[];
}

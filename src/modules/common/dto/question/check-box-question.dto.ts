import { Field, ObjectType } from '@nestjs/graphql';
import { BaseQuestionDto } from './base-question.dto';
import { QuestionOptionDto } from './question-option.dto';

@ObjectType()
export class CheckBoxQuestionDto extends BaseQuestionDto {
  @Field(() => String)
  type: 'checkbox';

  @Field(() => [QuestionOptionDto])
  options: QuestionOptionDto[];
}

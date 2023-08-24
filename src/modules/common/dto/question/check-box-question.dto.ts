import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BaseQuestionDto } from './base-question.dto';
import { QuestionOptionDto } from './question-option.dto';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';
import { PlainQuestion } from './question.types';

type QuestionType = 'checkbox';

type PlainCheckBoxQuestion = PlainQuestion & {
  type: QuestionType;
};


@ObjectType({ implements: () => BaseQuestionDto })
@InputType('CheckBoxQuestionInput')
export class CheckBoxQuestionDto extends BaseQuestionDto {
  @Field(() => String)
  type: 'checkbox';

  @Field(() => [QuestionOptionDto])
  options: QuestionOptionDto[];

  static adapter: FirebaseAdapter<PlainCheckBoxQuestion, CheckBoxQuestionDto>;
}

CheckBoxQuestionDto.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    depsId: external.depsId,
    ...BaseQuestionDto.adapter.toInternal(external),
    type: 'checkbox' as QuestionType,
    options: external.options.map((option) =>
      QuestionOptionDto.adapter.toInternal(option),
    ),
  }),
  toExternal: (internal) => ({
    ...BaseQuestionDto.adapter.toExternal(internal),
    type: 'checkbox' as QuestionType,
    options: internal.options.map((option) =>
      QuestionOptionDto.adapter.toExternal(option),
    ),
  }),
});

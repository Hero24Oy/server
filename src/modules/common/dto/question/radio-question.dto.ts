import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { BaseQuestionDto } from './base-question.dto';
import { QuestionOptionDto } from './question-option.dto';
import { PlainQuestion } from './question.types';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

type QuestionType = 'radio';

type PlainRadioQuestion = PlainQuestion & {
  type: QuestionType;
};

@ObjectType({ implements: () => BaseQuestionDto })
@InputType('RadioQuestionInput')
export class RadioQuestionDto extends BaseQuestionDto {
  @Field(() => String)
  type: 'radio';

  @Field(() => String, { nullable: true })
  selectedOption?: MaybeType<string>;

  @Field(() => [QuestionOptionDto])
  options: QuestionOptionDto[];
  static adapter: FirebaseAdapter<PlainRadioQuestion, RadioQuestionDto>;
}

RadioQuestionDto.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    depsId: external.depsId,
    ...BaseQuestionDto.adapter.toInternal(external),
    type: 'radio' as QuestionType,
    selectedOption: external.selectedOption || undefined,
    options: external.options.map((option) =>
      QuestionOptionDto.adapter.toInternal(option),
    ),
  }),
  toExternal: (internal) => ({
    ...BaseQuestionDto.adapter.toExternal(internal),
    type: 'radio' as QuestionType,
    selectedOption: internal.selectedOption,
    options: internal.options.map((option) =>
      QuestionOptionDto.adapter.toExternal(option),
    ),
  }),
});

import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { BaseQuestionDto } from './base-question.dto';
import { PlainQuestion } from './question.types';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

type QuestionType = 'number_input';

type PlainNumberInputQuestion = PlainQuestion & {
  type: QuestionType;
};

@ObjectType({ implements: () => BaseQuestionDto })
@InputType('NumberInputQuestionInput')
export class NumberInputQuestionDto extends BaseQuestionDto {
  @Field(() => String)
  type: 'number_input';
  
  @Field(() => TranslationFieldDto, { nullable: true })
  placeholder?: MaybeType<TranslationFieldDto>;

  @Field(() => String, { nullable: true })
  value?: MaybeType<string>;

  static adapter: FirebaseAdapter<
    PlainNumberInputQuestion,
    NumberInputQuestionDto
  >;
}

NumberInputQuestionDto.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    depsId: external.depsId,
    ...BaseQuestionDto.adapter.toInternal(external),
    type: 'number_input' as QuestionType,
    placeholder: external.placeholder || undefined,
    defaultValue: external.value || undefined,
  }),
  toExternal: (internal) => ({
    ...BaseQuestionDto.adapter.toExternal(internal),
    type: 'number_input' as QuestionType,
    placeholder: internal.placeholder,
    value: internal.defaultValue,
  }),
});

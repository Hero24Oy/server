import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { BaseQuestionDto } from './base-question.dto';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';
import { PlainQuestion } from './question.types';

type QuestionType = 'textarea';

type PlainTextAreaQuestion = PlainQuestion & {
  type: QuestionType;
};

@ObjectType({ implements: () => BaseQuestionDto })
@InputType('TextAreaQuestionInput')
export class TextAreaQuestionDto extends BaseQuestionDto {
  @Field(() => String)
  type: 'textarea';

  @Field(() => TranslationFieldDto, { nullable: true })
  placeholder?: MaybeType<TranslationFieldDto>;

  @Field(() => String, { nullable: true })
  value?: MaybeType<string>;

  static adapter: FirebaseAdapter<
    PlainTextAreaQuestion,
    TextAreaQuestionDto
  >;
}

TextAreaQuestionDto.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    depsId: external.depsId,
    ...BaseQuestionDto.adapter.toInternal(external),
    type: 'textarea' as QuestionType,
    placeholder: external.placeholder || undefined,
    value: external.value || undefined,
  }),
  toExternal: (internal) => ({
    ...BaseQuestionDto.adapter.toExternal(internal),
    type: 'textarea' as QuestionType,
    placeholder: internal.placeholder,
    value: internal.value,
  }),
});

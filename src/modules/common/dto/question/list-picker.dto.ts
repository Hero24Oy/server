import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { BaseQuestionDto } from './base-question.dto';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';
import { PlainQuestion } from './question.types';

type QuestionType = 'list';

type PlainListQuestion = PlainQuestion & {
  type: QuestionType;
};

@ObjectType({ implements: () => BaseQuestionDto })
@InputType('ListQuestionInput')
export class ListPickerDto extends BaseQuestionDto {
  @Field(() => String)
  type: 'list';

  @Field(() => TranslationFieldDto, { nullable: true })
  placeholder?: MaybeType<TranslationFieldDto>;

  @Field(() => Float, { nullable: true })
  defaultValue?: MaybeType<number>;
  
  static adapter: FirebaseAdapter<
    PlainListQuestion,
    ListPickerDto
  >;
}

ListPickerDto.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    depsId: external.depsId,
    ...BaseQuestionDto.adapter.toInternal(external),
    type: 'list' as QuestionType,
    placeholder: external.placeholder || undefined,
    defaultValue: external.defaultValue || undefined,
  }),
  toExternal: (internal) => ({
    ...BaseQuestionDto.adapter.toExternal(internal),
    type: 'list' as QuestionType,
    placeholder: internal.placeholder,
    defaultValue: internal.defaultValue,
  }),
});
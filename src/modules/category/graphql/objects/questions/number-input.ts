import { Field, ObjectType } from '@nestjs/graphql';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

import { BaseQuestionObject } from './base';

import { QuestionType } from '$modules/category/enums';
import { PlainQuestion } from '$modules/category/types';
import { MaybeType } from '$modules/common/common.types';
import { TranslationFieldDto } from '$modules/common/dto/translation-field.dto';

type LocalPlainQuestion = PlainQuestion & {
  type: `${QuestionType.NUMBER_INPUT}`;
};

@ObjectType({ implements: () => BaseQuestionObject })
export class NumberInputQuestionObject extends BaseQuestionObject {
  @Field(() => String)
  declare type: QuestionType;

  @Field(() => TranslationFieldDto, { nullable: true })
  placeholder?: MaybeType<TranslationFieldDto>;

  @Field(() => String, { nullable: true })
  value?: MaybeType<string>;

  declare static adapter: FirebaseAdapter<
    LocalPlainQuestion,
    NumberInputQuestionObject
  >;
}

NumberInputQuestionObject.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    depsId: external.depsId ?? undefined,
    ...BaseQuestionObject.adapter.toInternal(external),
    type: QuestionType.NUMBER_INPUT as QuestionType.NUMBER_INPUT,
    placeholder: external.placeholder ?? undefined,
    defaultValue: external.value ?? undefined,
  }),
  toExternal: (internal) => ({
    ...BaseQuestionObject.adapter.toExternal(internal),
    type: QuestionType.NUMBER_INPUT as QuestionType.NUMBER_INPUT,
    placeholder: internal.placeholder,
    value: internal.defaultValue,
  }),
});

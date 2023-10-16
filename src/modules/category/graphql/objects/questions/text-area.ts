import { Field, ObjectType } from '@nestjs/graphql';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

import { BaseQuestionObject } from './base';

import { QuestionType } from '$modules/category/enums';
import { PlainQuestion } from '$modules/category/types';
import { MaybeType } from '$modules/common/common.types';
import { TranslationFieldDto } from '$modules/common/dto/translation-field.dto';

type LocalPlainQuestion = PlainQuestion & {
  type: `${QuestionType.TEXT_AREA}`;
};

@ObjectType({ implements: () => BaseQuestionObject })
export class TextAreaQuestionObject extends BaseQuestionObject {
  @Field(() => String)
  declare type: QuestionType;

  @Field(() => TranslationFieldDto, { nullable: true })
  placeholder?: MaybeType<TranslationFieldDto>;

  @Field(() => String, { nullable: true })
  value?: MaybeType<string>;

  declare static adapter: FirebaseAdapter<
    LocalPlainQuestion,
    TextAreaQuestionObject
  >;
}

TextAreaQuestionObject.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    depsId: external.depsId ?? undefined,
    ...BaseQuestionObject.adapter.toInternal(external),
    type: QuestionType.TEXT_AREA as QuestionType.TEXT_AREA,
    placeholder: external.placeholder ?? undefined,
    value: external.value ?? undefined,
  }),
  toExternal: (internal) => ({
    ...BaseQuestionObject.adapter.toExternal(internal),
    type: QuestionType.TEXT_AREA as QuestionType.TEXT_AREA,
    placeholder: internal.placeholder,
    value: internal.value,
  }),
});

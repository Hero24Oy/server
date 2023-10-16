import { Field, Float, ObjectType } from '@nestjs/graphql';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

import { BaseQuestionObject } from './base';

import { QuestionType } from '$modules/category/enums';
import { PlainQuestion } from '$modules/category/types';
import { MaybeType } from '$modules/common/common.types';
import { TranslationFieldDto } from '$modules/common/dto/translation-field.dto';

type LocalPlainQuestion = PlainQuestion & {
  type: `${QuestionType.LIST_PICKER}`;
};

@ObjectType({ implements: () => BaseQuestionObject })
export class ListPickerQuestionObject extends BaseQuestionObject {
  @Field(() => String)
  declare type: QuestionType;

  @Field(() => TranslationFieldDto, { nullable: true })
  placeholder?: MaybeType<TranslationFieldDto>;

  @Field(() => Float, { nullable: true })
  defaultValue?: MaybeType<number>;

  declare static adapter: FirebaseAdapter<
    LocalPlainQuestion,
    ListPickerQuestionObject
  >;
}

ListPickerQuestionObject.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    depsId: external.depsId ?? undefined,
    ...BaseQuestionObject.adapter.toInternal(external),
    type: QuestionType.LIST_PICKER as QuestionType.LIST_PICKER,
    placeholder: external.placeholder ?? undefined,
    defaultValue: external.defaultValue ?? undefined,
  }),
  toExternal: (internal) => ({
    ...BaseQuestionObject.adapter.toExternal(internal),
    type: QuestionType.LIST_PICKER as QuestionType.LIST_PICKER,
    placeholder: internal.placeholder,
    defaultValue: internal.defaultValue,
  }),
});

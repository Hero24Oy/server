import { Field, ObjectType } from '@nestjs/graphql';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

import { BaseQuestionObject } from './base';
import { QuestionOptionObject } from './option';

import { QuestionType } from '$modules/category/enums';
import { PlainQuestion } from '$modules/category/types';

type LocalPlainQuestion = PlainQuestion & {
  type: `${QuestionType.CHECKBOX}`;
};

@ObjectType({ implements: () => BaseQuestionObject })
export class CheckBoxQuestionObject extends BaseQuestionObject {
  @Field(() => String)
  declare type: QuestionType;

  @Field(() => [QuestionOptionObject])
  options: QuestionOptionObject[];

  declare static adapter: FirebaseAdapter<
    LocalPlainQuestion,
    CheckBoxQuestionObject
  >;
}

CheckBoxQuestionObject.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    depsId: external.depsId ?? undefined,
    ...BaseQuestionObject.adapter.toInternal(external),
    type: QuestionType.CHECKBOX as QuestionType.CHECKBOX,
    options: external.options.map((option) =>
      QuestionOptionObject.adapter.toInternal(option),
    ),
  }),
  toExternal: (internal) => ({
    ...BaseQuestionObject.adapter.toExternal(internal),
    type: QuestionType.CHECKBOX as QuestionType.CHECKBOX,
    options: Object.values(internal.options).map((option) =>
      QuestionOptionObject.adapter.toExternal(option),
    ),
  }),
});

import { Field, ObjectType } from '@nestjs/graphql';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

import { BaseQuestionObject } from './base';
import { QuestionOptionObject } from './option';

import { QuestionType } from '$modules/category/enums';
import { PlainQuestion } from '$modules/category/types';
import { MaybeType } from '$modules/common/common.types';

type LocalPlainQuestion = PlainQuestion & {
  type: `${QuestionType.RADIO}`;
};

@ObjectType({ implements: () => BaseQuestionObject })
export class RadioQuestionObject extends BaseQuestionObject {
  @Field(() => String)
  declare type: QuestionType;

  @Field(() => String, { nullable: true })
  selectedOption?: MaybeType<string>;

  @Field(() => [QuestionOptionObject])
  options: QuestionOptionObject[];

  declare static adapter: FirebaseAdapter<
    LocalPlainQuestion,
    RadioQuestionObject
  >;
}

RadioQuestionObject.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    depsId: external.depsId ?? undefined,
    ...BaseQuestionObject.adapter.toInternal(external),
    type: QuestionType.RADIO as QuestionType.RADIO,
    selectedOption: external.selectedOption ?? undefined,
    options: external.options.map((option) =>
      QuestionOptionObject.adapter.toInternal(option),
    ),
  }),
  toExternal: (internal) => ({
    ...BaseQuestionObject.adapter.toExternal(internal),
    type: QuestionType.RADIO as QuestionType.RADIO,
    selectedOption: internal.selectedOption,
    options: Object.values(internal.options).map((option) =>
      QuestionOptionObject.adapter.toExternal(option),
    ),
  }),
});

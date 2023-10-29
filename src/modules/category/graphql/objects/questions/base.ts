import { Field, Int, InterfaceType } from '@nestjs/graphql';
import { BaseQuestionDB } from 'hero24-types';

import { QUESTION_FLAT_ID_NAME } from '$modules/category/constants';
import { QuestionType } from '$modules/category/enums';
import { MaybeType } from '$modules/common/common.types';
import { TranslationFieldDto } from '$modules/common/dto/translation-field.dto';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@InterfaceType()
export abstract class BaseQuestionObject {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  depsId?: MaybeType<string>; // we don't use [QUESTION_FLAT_ID_NAME] here, nest throw type error

  @Field(() => TranslationFieldDto, { nullable: true })
  name?: MaybeType<TranslationFieldDto>;

  @Field(() => Boolean, { nullable: true })
  optional?: MaybeType<boolean>;

  @Field(() => Int)
  order: number;

  @Field(() => String)
  type: QuestionType;

  @Field(() => Boolean, { nullable: true })
  showError?: MaybeType<boolean>;

  @Field(() => Number, { nullable: true })
  position?: MaybeType<number>;

  static adapter: FirebaseAdapter<BaseQuestionDB, BaseQuestionObject>;
}

BaseQuestionObject.adapter = new FirebaseAdapter({
  toInternal: (external) => {
    return {
      id: external.id,
      name: external.name ?? undefined,
      optional: external.optional ?? undefined,
      order: external.order,
      type: external.type,
      showError: external.showError ?? undefined,
      position: external.position ?? undefined,
      [QUESTION_FLAT_ID_NAME]: external[QUESTION_FLAT_ID_NAME],
    };
  },
  toExternal: (internal) => {
    return {
      id: internal.id,
      name: internal.name,
      optional: internal.optional,
      order: internal.order,
      type: internal.type as QuestionType,
      showError: internal.showError,
      position: internal.position,
      [QUESTION_FLAT_ID_NAME]: undefined,
    };
  },
});

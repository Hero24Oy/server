import { Field, Int, ObjectType } from '@nestjs/graphql';

import { PlainQuestionOption } from '$modules/category/types';
import { MaybeType } from '$modules/common/common.types';
import { TranslationFieldDto } from '$modules/common/dto/translation-field.dto';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
export class QuestionOptionObject {
  @Field(() => String)
  id: string;

  @Field(() => TranslationFieldDto, { nullable: true })
  name?: MaybeType<TranslationFieldDto>;

  @Field(() => Int, { nullable: true })
  order?: MaybeType<number>;

  @Field(() => [String], { nullable: true })
  questions?: MaybeType<string[]>;

  @Field(() => Boolean, { nullable: true })
  checked?: MaybeType<boolean>;

  static adapter: FirebaseAdapter<PlainQuestionOption, QuestionOptionObject>;
}

QuestionOptionObject.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    id: external.id,
    name: external.name ?? undefined,
    questions: external.questions ?? null,
    order: external.order ?? undefined,
    checked: external.checked ?? undefined,
  }),
  toExternal: (internal) => ({
    id: '',
    checked: internal.checked,
    name: internal.name,
    order: internal.order,
    questions: internal.questions,
  }),
});

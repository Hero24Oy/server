import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';
import { PlainQuestionOption } from './question.types';

@ObjectType()
@InputType('QuestionOptionInput')
export class QuestionOptionDto {
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

  static adapter: FirebaseAdapter<
    PlainQuestionOption,
    QuestionOptionDto
  >;
}

QuestionOptionDto.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    id: external.id,
    name: external.name || undefined,
    questions: external.questions || null,
    order: external.order ?? undefined,
    checked: external.checked ?? undefined,
  }),
  toExternal: (internal) => ({
    id: "",
    checked: internal.checked,
    name: internal.name,
    order: internal.order,
    questions: internal.questions,
  }),
});

import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

import { PlainOfferRequestQuestionOption } from '../../offer-request-question.types';

import { MaybeType } from '$/src/modules/common/common.types';
import { TranslationFieldDto } from '$/src/modules/common/dto/translation-field.dto';
import { FirebaseAdapter } from '$/src/modules/firebase/firebase.adapter';

@ObjectType()
@InputType('OfferRequestQuestionOptionInput')
export class OfferRequestQuestionOptionDto {
  @Field(() => String)
  id: string;

  @Field(() => TranslationFieldDto, { nullable: true })
  name?: MaybeType<TranslationFieldDto>;

  @Field(() => Int, { nullable: true })
  order?: MaybeType<number>;

  // it will be used to tackle circular deps in graphql. This is custom ID, generated on the go.
  @Field(() => [String], { nullable: true })
  questions?: MaybeType<string[]>;

  @Field(() => Boolean, { nullable: true })
  checked?: MaybeType<boolean>;

  static adapter: FirebaseAdapter<
    PlainOfferRequestQuestionOption,
    OfferRequestQuestionOptionDto
  >;
}

OfferRequestQuestionOptionDto.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    id: external.id,
    name: external.name || null,
    questions: external.questions || null,
    order: external.order ?? null,
    checked: external.checked ?? null,
  }),
  toExternal: (internal) => ({
    id: internal.id,
    checked: internal.checked,
    name: internal.name,
    order: internal.order,
    questions: internal.questions,
  }),
});

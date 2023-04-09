import { Field, InputType, Int } from '@nestjs/graphql';

import { MaybeType } from 'src/modules/common/common.types';
import { TranslationFieldInput } from 'src/modules/common/dto/translation-field.input';

@InputType()
export class OfferRequestBaseQuestionInput {
  @Field(() => String)
  id: string;

  @Field(() => TranslationFieldInput, { nullable: true })
  name?: MaybeType<TranslationFieldInput>;

  @Field(() => Int)
  order: number;

  @Field(() => String)
  type: string;
}

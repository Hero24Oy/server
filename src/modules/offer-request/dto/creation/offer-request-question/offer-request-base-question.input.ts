import { Field, InputType, Int } from '@nestjs/graphql';
import { OfferRequestBaseQuestion } from 'hero24-types';

import { MaybeType } from 'src/modules/common/common.types';
import { omitUndefined } from 'src/modules/common/common.utils';
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

  protected static convertBaseToFirebaseType<
    T extends OfferRequestBaseQuestionInput,
  >(base: T): OfferRequestBaseQuestion & { type: T['type'] } {
    return omitUndefined({
      id: base.id,
      name: base.name || null,
      order: base.order,
      type: base.type,
    });
  }
}

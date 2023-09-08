import { Field, InputType, PartialType } from '@nestjs/graphql';

import { PromotionCreationInput } from '../creation/promotion-creation.input';

@InputType()
export class PromotionEditingInput extends PartialType(PromotionCreationInput) {
  @Field(() => String)
  id: string;
}

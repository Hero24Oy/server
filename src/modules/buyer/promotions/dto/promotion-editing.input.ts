import { Field, InputType, PartialType } from '@nestjs/graphql';
import { PromotionsCreationInput } from './promotion-creation.args';

@InputType()
export class PromotionEditingInput extends PartialType(
  PromotionsCreationInput,
) {
  @Field(() => String)
  id: string;
}

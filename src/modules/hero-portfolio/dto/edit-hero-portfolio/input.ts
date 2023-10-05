import { Field, InputType } from '@nestjs/graphql';

import { MaybeType } from '$modules/common/common.types';

@InputType()
export class EditHeroPortfolioInput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  sellerId: string;

  @Field(() => String, { nullable: true })
  categoryId?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  imageIds?: MaybeType<string[]>;
}

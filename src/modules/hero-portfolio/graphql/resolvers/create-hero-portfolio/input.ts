import { Field, InputType } from '@nestjs/graphql';

import { MaybeType } from '$modules/common/common.types';

@InputType()
export class CreateHeroPortfolioInput {
  @Field(() => String)
  categoryId: string;

  @Field(() => String, { nullable: true })
  description: MaybeType<string>;

  @Field(() => [String], { nullable: true })
  imageIds?: MaybeType<string[]>;
}

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class HeroPortfolioRemovedOutput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  sellerId: string;
}

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class HeroPortfolioListFilterInput {
  @Field(() => String)
  sellerId: string;
}

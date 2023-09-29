import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class HeroPortfolioListFilterInput {
  @Field(() => String)
  sellerId: string;
}

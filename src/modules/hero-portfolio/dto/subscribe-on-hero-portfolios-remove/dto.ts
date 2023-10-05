import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class HeroPortfolioRemoved {
  @Field(() => String)
  id: string;

  @Field(() => String)
  sellerId: string;
}

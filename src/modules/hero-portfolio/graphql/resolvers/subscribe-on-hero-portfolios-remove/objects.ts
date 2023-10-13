import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class HeroPortfolioRemoveObject {
  @Field(() => String)
  id: string;

  @Field(() => String)
  sellerId: string;
}

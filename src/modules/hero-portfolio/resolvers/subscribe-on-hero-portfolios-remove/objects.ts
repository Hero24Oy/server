import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class HeroPortfolioRemovedObject {
  @Field(() => String)
  id: string;

  @Field(() => String)
  sellerId: string;
}

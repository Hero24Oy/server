import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SubscribeOnHeroPortfolioRemoveOutput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  sellerId: string;
}
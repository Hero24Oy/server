import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class HeroPortfolioRemovedDto {
  @Field(() => String)
  portfolioId: string;
}

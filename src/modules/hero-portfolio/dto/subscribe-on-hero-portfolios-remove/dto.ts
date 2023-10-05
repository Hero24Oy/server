import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class HeroPortfolioRemovedDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  sellerId: string;
}

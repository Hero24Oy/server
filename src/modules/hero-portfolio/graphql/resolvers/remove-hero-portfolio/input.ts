import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RemoveHeroPortfolioInput {
  @Field(() => String)
  id: string;
}

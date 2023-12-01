import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateIndividualHeroUserInput {
  @Field(() => String)
  companyRepresentativeId: string;
}

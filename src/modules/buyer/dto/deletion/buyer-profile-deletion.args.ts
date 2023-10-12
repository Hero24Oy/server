import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class BuyerProfileDeletionArgs {
  @Field(() => String)
  id: string;
}

import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class SellerProfileDeletionArgs {
  @Field(() => String)
  id: string;
}

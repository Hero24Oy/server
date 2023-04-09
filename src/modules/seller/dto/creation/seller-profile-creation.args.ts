import { ArgsType, Field } from '@nestjs/graphql';
import { SellerProfileDataInput } from './seller-profile-data.input';

@ArgsType()
export class SellerProfileCreationArgs {
  @Field(() => String)
  id: string;

  @Field(() => SellerProfileDataInput)
  data: SellerProfileDataInput;
}

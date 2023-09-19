import { ArgsType, Field } from '@nestjs/graphql';

import { SellerProfileDataDto } from '../seller/seller-profile-data';

@ArgsType()
export class SellerProfileCreationArgs {
  @Field(() => String)
  id: string;

  @Field(() => SellerProfileDataDto)
  data: SellerProfileDataDto;
}

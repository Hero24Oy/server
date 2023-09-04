import { ArgsType, Field } from '@nestjs/graphql';
import { BuyerProfileDataDto } from '../buyer/buyer-profile-data.dto';

@ArgsType()
export class BuyerProfileCreationArgs {
  @Field(() => String)
  id: string;

  @Field(() => BuyerProfileDataDto)
  data: BuyerProfileDataDto;
}

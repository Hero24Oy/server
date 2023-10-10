import { SellerProfileDto } from '$modules/seller/dto/seller/seller-profile.dto';
import { UserDto } from '$modules/user/dto/user/user.dto';

export type CreateNetvisorAccountArguments = {
  seller: SellerProfileDto;
  user: UserDto;
};

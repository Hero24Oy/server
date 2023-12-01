import { BuyerProfileDto } from '$modules/buyer/dto/buyer/buyer-profile.dto';
import { SellerProfileDto } from '$modules/seller/dto/seller/seller-profile.dto';

export const checkUserDoesNotHasMangopayAccount = (
  user: BuyerProfileDto | SellerProfileDto,
): void => {
  if (user.mangopay) {
    throw new Error('User already has a mangopay account');
  }
};

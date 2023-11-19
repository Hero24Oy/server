import { BuyerProfileDB } from 'hero24-types';

import { CustomerType } from './dto/buyer/buyer-profile-data.dto';

import { MaybeType } from '$modules/common/common.types';

// TODO remove after hero24-types updated
export type CustomerProfileDataDB = {
  type: MaybeType<`${CustomerType}`>;
  businessId?: string;
  businessName?: string;
} & BuyerProfileDB['data'];

export type CustomerProfileDB = BuyerProfileDB & {
  data: CustomerProfileDataDB;
};

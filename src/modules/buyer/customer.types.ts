import { BuyerProfileDB } from 'hero24-types';

import { CustomerType } from './dto/buyer/buyer-profile-data.dto';

// TODO remove after hero24-types updated
export type CustomerProfileDataDB = {
  type: `${CustomerType}`;
  businessId?: string;
  businessName?: string;
} & BuyerProfileDB['data'];

export type CustomerProfileDB = BuyerProfileDB & {
  data: CustomerProfileDataDB;
};

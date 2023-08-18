import { InputType, IntersectionType, PickType } from '@nestjs/graphql';

import { OfferInitialDataInput } from './initial-data.input';
import { OfferRequestIdInput } from '../editing/offer-request-id.input';

@InputType()
export class AcceptanceGuardInput extends IntersectionType(
  OfferRequestIdInput,
  PickType(OfferInitialDataInput, ['sellerProfileId']),
) {}

import { InputType, IntersectionType, PickType } from '@nestjs/graphql';

import { OfferRequestIdInput } from '../editing/offer-request-id.input';

import { OfferInitialDataInput } from './initial-data.input';

@InputType()
export class AcceptanceGuardInput extends IntersectionType(
  OfferRequestIdInput,
  PickType(OfferInitialDataInput, ['sellerProfileId']),
) {}

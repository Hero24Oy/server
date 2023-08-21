import { InputType, IntersectionType } from '@nestjs/graphql';

import { OfferIdInput } from './offer-id.input';
import { OfferRequestIdInput } from './offer-request-id.input';

@InputType()
export class OfferAndRequestIdsInput extends IntersectionType(
  OfferIdInput,
  OfferRequestIdInput,
) {}

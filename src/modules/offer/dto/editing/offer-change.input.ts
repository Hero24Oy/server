import {
  InputType,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/graphql';

import { OfferInitialDataInput } from '../creation/initial-data.input';

import { OfferIdInput } from './offer-id.input';

@InputType()
export class OfferChangeInput extends IntersectionType(
  OfferIdInput,
  PartialType(PickType(OfferInitialDataInput, ['agreedStartTime'])),
) {}

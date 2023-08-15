import {
  InputType,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/graphql';

import { InitialDataInput } from '../creation/initial-data.input';
import { OfferIdInput } from './offer-id.input';

@InputType()
export class OfferChangeInput extends IntersectionType(
  OfferIdInput,
  PartialType(PickType(InitialDataInput, ['agreedStartTime'])),
) {}

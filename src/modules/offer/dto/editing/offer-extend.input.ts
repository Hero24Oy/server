import {
  Field,
  Float,
  InputType,
  IntersectionType,
  PickType,
} from '@nestjs/graphql';

import { OfferDto } from '../offer/offer.dto';
import { OfferIdInput } from './offer-id.input';

@InputType()
export class OfferExtendInput extends IntersectionType(
  OfferIdInput,
  PickType(OfferDto, ['reasonToExtend', 'timeToExtend'], InputType),
) {
  @Field(() => Float)
  timeToExtend: number;

  @Field(() => String)
  reasonToExtend: string;
}

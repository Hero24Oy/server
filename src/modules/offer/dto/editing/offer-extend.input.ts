import { InputType, PickType } from '@nestjs/graphql';
import { OfferDto } from '../offer/offer.dto';

@InputType()
export class OfferExtendInput extends PickType(
  OfferDto,
  ['reasonToExtend', 'timeToExtend'],
  InputType,
) {}

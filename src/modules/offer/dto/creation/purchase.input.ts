import { InputType, PickType } from '@nestjs/graphql';

import { PurchaseDto } from '../offer/purchase.dto';

@InputType()
export class PurchaseInput extends PickType(
  PurchaseDto,
  ['pricePerHour', 'duration'],
  InputType,
) {}

import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { InitialDataInput } from '../creation/initial-data.input';

@InputType()
export class OfferChangeInput extends PartialType(
  PickType(InitialDataInput, ['agreedStartTime']),
) {}

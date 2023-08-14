import { InputType, PickType } from '@nestjs/graphql';
import { InitialDataInput } from './initial-data.input';

@InputType()
export class AcceptanceGuardInput extends PickType(InitialDataInput, [
  'offerRequestId',
  'sellerProfileId',
]) {}

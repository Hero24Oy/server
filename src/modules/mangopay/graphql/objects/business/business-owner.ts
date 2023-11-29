import { Field, ObjectType } from '@nestjs/graphql';

import { MangopayBusinessAddressObject } from './business-address';

@ObjectType()
export class MangopayBusinessOwnerObject {
  @Field(() => MangopayBusinessAddressObject)
  address: MangopayBusinessAddressObject;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  firstName: string;
}

import { ObjectType } from '@nestjs/graphql';

import { MangopayBusinessOwnerObject } from './business-owner';

@ObjectType()
export class MangopayCustomerBusinessOwnerObject extends MangopayBusinessOwnerObject {}

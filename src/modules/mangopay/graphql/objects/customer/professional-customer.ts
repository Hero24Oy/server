import { Field, ObjectType } from '@nestjs/graphql';
import { MangoPayUserType } from 'hero24-types';

import { MangopayCustomerBusinessOwnerObject } from '../business';
import { MangopayUserObject } from '../user';

@ObjectType()
export class MangopayProfessionalCustomerObject extends MangopayUserObject {
  @Field(() => MangoPayUserType)
  type: MangoPayUserType.PROFESSIONAL;

  @Field(() => MangopayCustomerBusinessOwnerObject)
  businessOwner: MangopayCustomerBusinessOwnerObject;
}

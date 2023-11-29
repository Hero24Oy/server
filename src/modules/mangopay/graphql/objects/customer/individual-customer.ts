import { Field, ObjectType } from '@nestjs/graphql';
import { MangoPayUserType } from 'hero24-types';

import { MangopayUserObject } from '../user';

@ObjectType()
export class MangopayIndividualCustomerObject extends MangopayUserObject {
  @Field(() => MangoPayUserType)
  type: MangoPayUserType.INDIVIDUAL;
}

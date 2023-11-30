import { Field, ObjectType } from '@nestjs/graphql';
import { MangoPayUserType } from 'hero24-types';

import { MangopayHeroBusinessOwnerObject } from '../business';
import { MangopayProfessionalUserObject } from '../professional-user';

@ObjectType()
export class MangopayProfessionalHeroObject extends MangopayProfessionalUserObject {
  @Field(() => String)
  type: MangoPayUserType.PROFESSIONAL;

  @Field(() => MangopayHeroBusinessOwnerObject)
  businessOwner: MangopayHeroBusinessOwnerObject;
}

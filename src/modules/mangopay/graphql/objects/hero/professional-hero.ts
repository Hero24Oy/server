import { Field, ObjectType } from '@nestjs/graphql';
import { MangoPayUserType } from 'hero24-types';

import { MangopayHeroBusinessOwnerObject } from '../business';
import { MangopayUserObject } from '../user';

@ObjectType()
export class MangopayProfessionalHeroObject extends MangopayUserObject {
  @Field(() => String)
  type: MangoPayUserType.PROFESSIONAL;

  @Field(() => MangopayHeroBusinessOwnerObject)
  businessOwner: MangopayHeroBusinessOwnerObject;
}

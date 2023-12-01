import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CountryISO } from 'mangopay2-nodejs-sdk';

import { MangopayBirthPlaceObject } from './birth-place';

import { MangopayAddressObject } from '$modules/mangopay/graphql';

@InputType('MangopayBeneficialOwnerInput')
@ObjectType()
export class MangopayBeneficialOwnerObject {
  @Field(() => MangopayAddressObject)
  address: MangopayAddressObject;

  @Field(() => Date)
  birthday: Date;

  @Field(() => MangopayBirthPlaceObject)
  birthplace: MangopayBirthPlaceObject;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  nationality: CountryISO;
}

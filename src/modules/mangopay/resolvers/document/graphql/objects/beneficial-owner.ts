import { Field, InputType, Int } from '@nestjs/graphql';
import { CountryISO } from 'mangopay2-nodejs-sdk';

import { MangopayBirthPlaceObject } from './birth-place';

import { MangopayAddressObject } from '$modules/mangopay/graphql';

@InputType()
export class MangopayBeneficialOwnerObject {
  @Field(() => MangopayAddressObject)
  address: MangopayAddressObject;

  @Field(() => Int)
  birthday: number;

  @Field(() => MangopayBirthPlaceObject)
  birthplace: MangopayBirthPlaceObject;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  nationality: CountryISO;
}

import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CountryISO } from 'mangopay2-nodejs-sdk';

import { BirthPlaceObject } from './birth-place';

import { AddressObject } from '$modules/mangopay/graphql';

@ObjectType()
export class BeneficialOwnerObject {
  @Field(() => AddressObject)
  address: AddressObject;

  @Field(() => Int)
  birthday: number;

  @Field(() => BirthPlaceObject)
  birthplace: BirthPlaceObject;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  nationality: CountryISO;
}

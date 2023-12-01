import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CountryISO } from 'mangopay2-nodejs-sdk';

@InputType('MangopayBirthPlaceInput')
@ObjectType()
export class MangopayBirthPlaceObject {
  @Field(() => String)
  city: string;

  @Field(() => String)
  country: CountryISO;
}

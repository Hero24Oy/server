import { Field, ObjectType } from '@nestjs/graphql';
import { CountryISO } from 'mangopay2-nodejs-sdk';

@ObjectType()
export class BirthPlaceObject {
  @Field(() => String)
  city: string;

  @Field(() => String)
  country: CountryISO;
}

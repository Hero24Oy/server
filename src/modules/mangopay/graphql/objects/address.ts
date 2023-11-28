import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CountryISO } from 'mangopay2-nodejs-sdk';

@InputType('MangopayAddressInput')
@ObjectType()
export class MangopayAddressObject {
  @Field(() => String)
  addressLine: string;

  @Field(() => String)
  city: string;

  @Field(() => String)
  country: CountryISO;

  @Field(() => String)
  postalCode: string;

  @Field(() => String, { nullable: true })
  region?: string;
}

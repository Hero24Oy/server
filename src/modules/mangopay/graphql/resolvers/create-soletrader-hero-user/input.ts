import { Field, InputType } from '@nestjs/graphql';
import { CountryISO } from 'mangopay2-nodejs-sdk';

import { MangopayAddressObject } from '../../objects';

@InputType()
export class CreateSoletraderHeroUserInput {
  @Field(() => MangopayAddressObject)
  legalRepresentativeAddress: MangopayAddressObject;

  @Field(() => MangopayAddressObject)
  headquartersAddress: MangopayAddressObject;

  @Field(() => String)
  nationality: CountryISO;

  @Field(() => String)
  countryOfResidence: CountryISO;

  @Field(() => Date)
  birthday: Date;
}

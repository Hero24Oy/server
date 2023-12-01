import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CountryISO } from 'mangopay2-nodejs-sdk';

import { MaybeType } from '$modules/common/common.types';

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
  region?: MaybeType<string>;
}

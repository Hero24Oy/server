import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CountryISO, Timestamp } from 'mangopay2-nodejs-sdk';

import { MangopayBusinessOwnerObject } from './business-owner';

@ObjectType()
export class MangopayHeroBusinessOwnerObject extends MangopayBusinessOwnerObject {
  @Field(() => Int)
  birthday: Timestamp;

  @Field(() => String)
  nationality: CountryISO;
}

import { Field, ObjectType } from '@nestjs/graphql';
import { MangoPayUser } from 'hero24-types';

@ObjectType()
export class MangopayUserObject implements MangoPayUser {
  @Field(() => String)
  id: string;

  @Field(() => String)
  walletId: string;
}

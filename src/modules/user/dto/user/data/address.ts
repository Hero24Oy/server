import { Field, ObjectType } from '@nestjs/graphql';
import { Address } from '../address';

@ObjectType()
export class UserDataAddress {
  @Field(() => String)
  key: string;

  @Field(() => Address)
  address: Address;
}

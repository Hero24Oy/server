import { Field, ObjectType } from '@nestjs/graphql';
import { Address } from '../../../../common/graphql-dto';

@ObjectType()
export class UserDataAddress {
  @Field(() => String)
  key: string;

  @Field(() => Address)
  address: Address;
}

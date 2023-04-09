import { Field, InputType } from '@nestjs/graphql';

import { PartialAddressInput } from '../../../common/dto/address/partial-address.input';

@InputType()
export class PartialUserDataAddressInput {
  @Field(() => String, { nullable: true })
  key?: string;

  @Field(() => PartialAddressInput, { nullable: true })
  address?: PartialAddressInput;
}

import { Field, InputType } from '@nestjs/graphql';

import { AddressDto } from 'src/modules/common/dto/address/address.dto';

@InputType()
export class BasicAddressesInput {
  @Field(() => String)
  type = 'basic' as const;

  @Field(() => AddressDto)
  main: AddressDto;
}

@InputType()
export class DeliveryAddressesInput {
  @Field(() => String)
  type = 'delivery' as const;

  @Field(() => AddressDto)
  from: AddressDto;

  @Field(() => AddressDto)
  to: AddressDto;
}

@InputType()
export class AddressesAnsweredInput {
  @Field(() => BasicAddressesInput, { nullable: true })
  basic?: BasicAddressesInput;

  @Field(() => DeliveryAddressesInput, { nullable: true })
  delivery?: DeliveryAddressesInput;
}

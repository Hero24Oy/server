import { Field, InputType } from '@nestjs/graphql';

import { BasicAddressesDto } from './basic-addresses.dto';
import { DeliveryAddressesDto } from './delivery-addresses.dto';

@InputType()
export class AddressesAnsweredInput {
  @Field(() => BasicAddressesDto, { nullable: true })
  basic?: BasicAddressesDto;

  @Field(() => DeliveryAddressesDto, { nullable: true })
  delivery?: DeliveryAddressesDto;
}

import { Field, ObjectType } from '@nestjs/graphql';
import { AddressDto } from 'src/modules/common/dto/address/address.dto';

@ObjectType()
export class DeliveryAddressesDto {
  constructor({ from, to }: Omit<DeliveryAddressesDto, 'type'>) {
    this.from = from;
    this.to = to;
  }

  @Field(() => String)
  type = 'delivery' as const;

  @Field(() => AddressDto)
  from: AddressDto;

  @Field(() => AddressDto)
  to: AddressDto;
}

import { createUnionType, Field, ObjectType } from '@nestjs/graphql';
import { AddressDto } from 'src/modules/common/dto/address/address.dto';

@ObjectType()
export class BasicAddressesDto {
  constructor({ main }: Omit<BasicAddressesDto, 'type'>) {
    this.main = main;
  }

  @Field(() => String)
  type = 'basic' as const;

  @Field(() => AddressDto)
  main: AddressDto;
}

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

export const AddressesAnsweredDto = createUnionType({
  name: 'AddressesAnsweredDto',
  types: () => [BasicAddressesDto, DeliveryAddressesDto] as const,
});

export type AddressesAnsweredDto = typeof AddressesAnsweredDto;

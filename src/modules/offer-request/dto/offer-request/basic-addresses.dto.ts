import { Field, ObjectType } from '@nestjs/graphql';
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

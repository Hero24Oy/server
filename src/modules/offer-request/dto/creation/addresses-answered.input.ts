import { Field, InputType } from '@nestjs/graphql';
import { AddressInput } from 'src/modules/common/dto/address/address.input';

@InputType()
export class BasicAddressesInput {
  @Field(() => String)
  type = 'basic' as const;

  @Field(() => AddressInput)
  main: AddressInput;
}

@InputType()
export class DeliveryAddressesInput {
  @Field(() => String)
  type = 'delivery' as const;

  @Field(() => AddressInput)
  from: AddressInput;

  @Field(() => AddressInput)
  to: AddressInput;
}

@InputType()
export class AddressesAnsweredInput {
  @Field(() => BasicAddressesInput, { nullable: true })
  basic?: BasicAddressesInput;

  @Field(() => DeliveryAddressesInput, { nullable: true })
  delivery?: DeliveryAddressesInput;
}

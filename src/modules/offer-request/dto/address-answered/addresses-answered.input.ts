import { Field, InputType } from '@nestjs/graphql';
import { AddressesAnswered } from 'hero24-types';

import { BasicAddressesDto } from './basic-addresses.dto';
import { DeliveryAddressesDto } from './delivery-addresses.dto';

import { MaybeType } from '$/src/modules/common/common.types';
import { FirebaseAdapter } from '$/src/modules/firebase/firebase.adapter';

@InputType()
export class AddressesAnsweredInput {
  @Field(() => BasicAddressesDto, { nullable: true })
  basic?: MaybeType<BasicAddressesDto>;

  @Field(() => DeliveryAddressesDto, { nullable: true })
  delivery?: MaybeType<DeliveryAddressesDto>;

  static adapter: FirebaseAdapter<AddressesAnswered, AddressesAnsweredInput>;
}

AddressesAnsweredInput.adapter = new FirebaseAdapter({
  toExternal: (internal: AddressesAnswered) => {
    if (internal.type === 'basic') {
      return {
        basic: BasicAddressesDto.adapter.toExternal(internal),
        delivery: null,
      };
    }

    return {
      delivery: DeliveryAddressesDto.adapter.toExternal(internal),
      basic: null,
    };
  },
  toInternal: (external: AddressesAnsweredInput) => {
    if (external.basic) {
      return BasicAddressesDto.adapter.toInternal(external.basic);
    }

    if (external.delivery) {
      return DeliveryAddressesDto.adapter.toInternal(external.delivery);
    }

    // TODO: handle it using validation
    throw new Error('Wrong address type');
  },
});

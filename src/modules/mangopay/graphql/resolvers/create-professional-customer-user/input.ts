import { Field, InputType } from '@nestjs/graphql';

import { MangopayAddressObject } from '../../objects';

@InputType()
export class CreateProfessionalCustomerUserInput {
  @Field(() => MangopayAddressObject)
  address: MangopayAddressObject;
}

import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { FeeDB } from 'hero24-types';

import { FirebaseAdapter } from '$/src/modules/firebase/firebase.adapter';

@ObjectType()
@InputType('FeeDataInput')
export class FeeDataDto {
  @Field(() => Float)
  quantity: number;

  @Field(() => Float)
  unitPrice: number;

  @Field(() => String)
  description: string;

  static adapter: FirebaseAdapter<FeeDB['data'], FeeDataDto>;
}

FeeDataDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    quantity: internal.quantity,
    unitPrice: internal.unitPrice,
    description: internal.description,
  }),
  toInternal: (external) => ({
    quantity: external.quantity,
    unitPrice: external.unitPrice,
    description: external.description,
  }),
});

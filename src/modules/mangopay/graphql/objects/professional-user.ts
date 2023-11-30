import { Field, ObjectType } from '@nestjs/graphql';

import { MaybeType } from '$modules/common/common.types';

@ObjectType()
export class MangopayProfessionalUserObject {
  @Field(() => String)
  id: string;

  @Field(() => String)
  walletId: string;

  @Field(() => String, { nullable: true })
  bankId?: MaybeType<string>;
}

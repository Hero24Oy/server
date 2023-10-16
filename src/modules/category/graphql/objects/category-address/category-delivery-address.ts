import { Field, ObjectType } from '@nestjs/graphql';

import { MaybeType } from '$modules/common/common.types';

@ObjectType()
export class CategoryDeliveryAddressObject {
  @Field(() => Boolean, { nullable: true })
  from: MaybeType<boolean>;

  @Field(() => Boolean, { nullable: true })
  to: MaybeType<boolean>;
}

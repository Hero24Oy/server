import { Field, ObjectType } from '@nestjs/graphql';

import { MaybeType } from '$modules/common/common.types';

@ObjectType()
export class CategoryMainAddressObject {
  @Field(() => Boolean, { nullable: true })
  main: MaybeType<boolean>;
}

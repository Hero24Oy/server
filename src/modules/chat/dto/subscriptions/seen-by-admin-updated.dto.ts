import { Field, ObjectType } from '@nestjs/graphql';

import { MaybeType } from '$modules/common/common.types';

@ObjectType()
export class SeenByAdminUpdatedDto {
  @Field(() => Boolean, { nullable: true })
  previous: MaybeType<boolean>;

  @Field(() => Boolean)
  current: boolean;

  @Field(() => String)
  chatId: string;
}

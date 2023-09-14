import { Field, InputType } from '@nestjs/graphql';

import { MaybeType } from '$modules/common/common.types';

@InputType()
export class NewsListFilterInput {
  @Field(() => Boolean, { nullable: true })
  isActive?: MaybeType<boolean>;
}

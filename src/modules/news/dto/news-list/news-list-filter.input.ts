import { Field, InputType } from '@nestjs/graphql';

import { MaybeType } from '$/src/modules/common/common.types';

@InputType()
export class NewsListFilterInput {
  @Field(() => Boolean, { nullable: true })
  isActive?: MaybeType<boolean>;
}

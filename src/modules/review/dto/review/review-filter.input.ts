import { Field, InputType } from '@nestjs/graphql';

import { MaybeType } from '$modules/common/common.types';

@InputType()
export class ReviewFilterInput {
  @Field(() => [String], { nullable: true })
  ids?: MaybeType<string[]>;
}

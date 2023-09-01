import { Field, InputType } from '@nestjs/graphql';

import { MaybeType } from 'src/modules/common/common.types';

@InputType()
export class SellerProfileFilterInput {
  @Field(() => [String], { nullable: true })
  ids?: MaybeType<string[]>;
}

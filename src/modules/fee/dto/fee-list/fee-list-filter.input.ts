import { Field, InputType } from '@nestjs/graphql';

import { FeeStatus } from '../fee/fee-status.enum';

import { MaybeType } from '$modules/common/common.types';

@InputType()
export class FeeListFilterInput {
  @Field(() => FeeStatus, { nullable: true })
  status?: MaybeType<FeeStatus>;

  @Field(() => String, { nullable: true })
  offerRequestId?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  buyerId?: MaybeType<string>;
}

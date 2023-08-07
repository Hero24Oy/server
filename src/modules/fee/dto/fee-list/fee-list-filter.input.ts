import { Field, InputType } from '@nestjs/graphql';

import { MaybeType } from 'src/modules/common/common.types';

import { FeeStatus } from '../fee/fee-status.enum';

@InputType()
export class FeeListFilterInput {
  @Field(() => FeeStatus, { nullable: true })
  status?: MaybeType<FeeStatus>;

  @Field(() => String, { nullable: true })
  offerRequestId?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  buyerId?: MaybeType<string>;
}

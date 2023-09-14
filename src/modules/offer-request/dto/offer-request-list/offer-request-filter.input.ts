import { Field, InputType } from '@nestjs/graphql';
import { OFFER_REQUEST_STATUS } from 'hero24-types';

import { MaybeType } from '$modules/common/common.types';

@InputType()
export class OfferRequestFilterInput {
  @Field(() => [String], { nullable: true })
  status?: MaybeType<OFFER_REQUEST_STATUS[]>;
}

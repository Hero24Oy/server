import { Field, InputType } from '@nestjs/graphql';
import { OFFER_STATUS } from 'hero24-types';

import { OfferStatus } from '../offer/offer-status.enum';

import { MaybeType } from '$/src/modules/common/common.types';

@InputType()
export class OffersFilterInput {
  @Field(() => [String], { nullable: true })
  ids?: MaybeType<string[]>;

  @Field(() => Boolean, { nullable: true })
  isApproved?: MaybeType<boolean>;

  @Field(() => [String], {
    nullable: true,
    description:
      'Offer can have one chat id. Give several chat ids, to filter for several offers',
  })
  chatIds?: MaybeType<string[]>;

  @Field(() => [OfferStatus], { nullable: true })
  statuses?: MaybeType<OFFER_STATUS[]>;
}

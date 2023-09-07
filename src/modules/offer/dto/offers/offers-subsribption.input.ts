import { Field, InputType } from '@nestjs/graphql';

import { OfferRoleInput } from '../offer/offer-role.input';
import { MaybeType } from 'src/modules/common/common.types';

@InputType()
export class OfferSubscriptionInput extends OfferRoleInput {
  @Field(() => [String], { nullable: true })
  offerIds?: MaybeType<string[]>;
}

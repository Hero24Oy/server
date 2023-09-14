import { Field, InputType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';

import { OfferRoleInput } from '../offer/offer-role.input';

@InputType()
export class OfferSubscriptionInput extends OfferRoleInput {
  @Field(() => [String], { nullable: true })
  offerIds?: MaybeType<string[]>;
}

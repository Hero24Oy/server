import { Field, InputType } from '@nestjs/graphql';

import { OfferRoleInput } from '../offer/offer-role.input';

@InputType()
export class OfferSubscriptionInput extends OfferRoleInput {
  @Field(() => [String], { nullable: true })
  offerIds?: string[];
}

import { Field, InputType } from '@nestjs/graphql';
import { OFFER_REQUEST_STATUS } from 'hero24-types';

import { OfferRole } from '$modules/offer/dto/offer/offer-role.enum';

@InputType()
export class OfferRequestUpdatedInput {
  @Field(() => OfferRole)
  role: OfferRole;

  @Field(() => [String], { nullable: true })
  statuses?: OFFER_REQUEST_STATUS[];

  @Field(() => [String], { nullable: true })
  ids?: string[];
}

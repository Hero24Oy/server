import { Field, InputType } from '@nestjs/graphql';

import { OfferRole as OfferRoleEnum } from './offer-role.enum';

@InputType()
export class OfferRoleInput {
  @Field(() => OfferRoleEnum, { nullable: true })
  role?: OfferRoleEnum;
}

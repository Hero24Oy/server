import { ArgsType, Field } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { OfferRole } from 'src/modules/offer/dto/offer/offer-role.enum';

@ArgsType()
export class OfferRequestUpdatedSubscriptionArgs {
  @Field(() => OfferRole, { nullable: true })
  role?: MaybeType<OfferRole>;
}

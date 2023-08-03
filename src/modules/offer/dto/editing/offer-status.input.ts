import { Field, InputType } from '@nestjs/graphql';
import { OfferStatus } from '../../offer.constants';

@InputType()
export class OfferStatusInput {
  @Field(() => OfferStatus)
  status: OfferStatus;
}

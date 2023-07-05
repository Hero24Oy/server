import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from 'src/modules/common/dto/pagination.args';
import { OfferRequestOrderInput } from './offer-request-order.input';

@ArgsType()
export class OfferRequestListArgs extends PaginationArgs {
  @Field(() => [OfferRequestOrderInput], { nullable: true })
  orderBy?: OfferRequestOrderInput[];
}

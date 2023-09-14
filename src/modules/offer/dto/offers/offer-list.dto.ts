import { ObjectType } from '@nestjs/graphql';

import { OfferDto } from '../offer/offer.dto';

import { Paginated } from '$modules/common/dto/pagination.dto';

@ObjectType()
export class OfferListDto extends Paginated(OfferDto) {}

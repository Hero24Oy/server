import { ObjectType } from '@nestjs/graphql';

import { OfferDto } from '../offer/offer.dto';

import { Paginated } from '$/src/modules/common/dto/pagination.dto';

@ObjectType()
export class OfferListDto extends Paginated(OfferDto) {}

import { ObjectType } from '@nestjs/graphql';

import { Paginated } from 'src/modules/common/dto/pagination.dto';

import { OfferDto } from '../offer/offer.dto';

@ObjectType()
export class OfferListDto extends Paginated(OfferDto) {}

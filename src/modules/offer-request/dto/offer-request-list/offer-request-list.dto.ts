import { ObjectType } from '@nestjs/graphql';

import { OfferRequestDto } from '../offer-request/offer-request.dto';

import { Paginated } from '$modules/common/dto/pagination.dto';

@ObjectType()
export class OfferRequestListDto extends Paginated(OfferRequestDto) {}

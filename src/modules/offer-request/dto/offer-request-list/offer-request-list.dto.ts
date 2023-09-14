import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/modules/common/dto/pagination.dto';

import { OfferRequestDto } from '../offer-request/offer-request.dto';

@ObjectType()
export class OfferRequestListDto extends Paginated(OfferRequestDto) {}

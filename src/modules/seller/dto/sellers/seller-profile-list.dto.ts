import { ObjectType } from '@nestjs/graphql';

import { SellerProfileDto } from '../seller/seller-profile.dto';

import { Paginated } from '$/src/modules/common/dto/pagination.dto';

@ObjectType()
export class SellerProfileListDto extends Paginated(SellerProfileDto) {}

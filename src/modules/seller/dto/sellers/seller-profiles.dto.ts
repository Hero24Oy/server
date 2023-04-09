import { ObjectType } from '@nestjs/graphql';
import { makePaginationDto } from 'src/modules/common/dto/pagination.dto';
import { SellerProfileDto } from '../seller/seller-profile.dto';

@ObjectType()
export class SellerProfilesDto extends makePaginationDto<
  SellerProfileDto,
  SellerProfileDto['id']
>('SellerProfilesDto', SellerProfileDto, String) {}

import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/modules/common/dto/pagination.dto';
import { SellerProfileDto } from '../seller/seller-profile.dto';

@ObjectType()
export class SellerProfileListDto extends Paginated(SellerProfileDto) {}

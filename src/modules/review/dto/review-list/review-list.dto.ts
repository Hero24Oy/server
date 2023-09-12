import { ObjectType } from '@nestjs/graphql';

import { ReviewDto } from '../review/review.dto';

import { Paginated } from '$/src/modules/common/dto/pagination.dto';

@ObjectType()
export class ReviewListDto extends Paginated(ReviewDto) {}

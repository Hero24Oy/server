import { ObjectType } from '@nestjs/graphql';

import { Paginated } from 'src/modules/common/dto/pagination.dto';
import { ReviewDto } from '../review/review.dto';

@ObjectType()
export class ReviewListDto extends Paginated(ReviewDto) {}

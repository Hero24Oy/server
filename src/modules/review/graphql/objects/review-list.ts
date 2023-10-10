import { ObjectType } from '@nestjs/graphql';

import { ReviewObject } from './review';

import { Paginated } from '$modules/common/dto/pagination.dto';

@ObjectType()
export class ReviewListObject extends Paginated(ReviewObject) {}

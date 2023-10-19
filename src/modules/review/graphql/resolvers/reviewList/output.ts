import { ObjectType } from '@nestjs/graphql';

import { ReviewObject } from '../../objects';

import { Paginated } from '$modules/common/dto/pagination.dto';

@ObjectType()
export class ReviewListOutput extends Paginated(ReviewObject) {}

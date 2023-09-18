import { InputType, OmitType } from '@nestjs/graphql';

import { ReviewDto } from '../review/review.dto';

@InputType()
export class ReviewDataInput extends OmitType(
  ReviewDto,
  ['createdAt', 'id'],
  InputType,
) {}

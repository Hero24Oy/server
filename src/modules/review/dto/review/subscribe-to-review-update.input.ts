import { Field, InputType } from '@nestjs/graphql';

import { ReviewFilterInput } from './review-filter.input';

@InputType()
export class SubscribeToReviewUpdateInput {
  @Field()
  filter: ReviewFilterInput;
}

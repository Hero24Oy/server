import { Field, InputType } from '@nestjs/graphql';

import { ReviewFilterObject } from '../../objects';

@InputType()
export class SubscribeToReviewCreateInput {
  @Field()
  filter: ReviewFilterObject;
}

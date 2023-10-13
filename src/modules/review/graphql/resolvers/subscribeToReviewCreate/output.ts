import { Field, ObjectType } from '@nestjs/graphql';

import { ReviewObject } from '../../objects';

@ObjectType()
export class SubscribeToReviewCreateOutput {
  @Field(() => ReviewObject)
  review: ReviewObject;
}

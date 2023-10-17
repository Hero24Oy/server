import { Field, ObjectType } from '@nestjs/graphql';

import { ReviewObject } from '../../objects';

@ObjectType()
export class CreateReviewOutput {
  @Field()
  review: ReviewObject;
}

import { Field, ObjectType } from '@nestjs/graphql';

import { ReviewListObject } from '../../objects';

@ObjectType()
export class ReviewListOutput {
  @Field()
  reviews: ReviewListObject;
}

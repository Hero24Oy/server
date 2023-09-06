import { ArgsType, Field } from '@nestjs/graphql';
import { ReviewDataInput } from './review-data.input';

@ArgsType()
export class ReviewCreationArgs {
  @Field(() => ReviewDataInput)
  input: ReviewDataInput;
}

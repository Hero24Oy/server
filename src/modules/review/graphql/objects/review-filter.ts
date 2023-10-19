import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
@InputType()
export class ReviewFilterObject {
  @Field(() => String, { nullable: true })
  sellerId: string;
}

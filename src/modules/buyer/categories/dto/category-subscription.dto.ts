import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CategorySubscriptionDto {
  @Field(() => String)
  categoryId: string;

  @Field(() => Number)
  discount: number;

  @Field(() => String)
  discountFormat: 'fixed' | 'percentage';
}

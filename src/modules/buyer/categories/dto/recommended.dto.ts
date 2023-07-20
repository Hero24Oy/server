import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RecommendedDto {
  @Field(() => String)
  categoryId: string;

  @Field(() => String)
  imageName: string;

  @Field(() => String)
  link: string;
}

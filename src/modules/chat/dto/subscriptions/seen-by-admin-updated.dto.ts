import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SeenByAdminUpdatedDto {
  @Field(() => Boolean, { nullable: true })
  previous: boolean | null;

  @Field(() => Boolean)
  current: boolean;

  @Field(() => String)
  chatId: string;
}

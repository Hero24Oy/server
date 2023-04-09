import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  offset: number;

  @Field(() => Int, { nullable: true })
  limit: number;
}

export const makePaginationBaseObject = <T, C = string>(
  prefix: string,
  Node: { new (): T },
  Cursor: typeof Int | typeof String = String,
) => {
  @ObjectType(`${prefix}EdgeObject`)
  class Edge {
    @Field(() => Node)
    node: T;

    @Field(() => Cursor)
    cursor: C;
  }

  @ObjectType(`${prefix}PaginationObject`)
  class PaginationObject {
    @Field(() => Int)
    total: number;

    @Field(() => [Edge])
    edges: Edge[];

    @Field(() => Boolean)
    hasNextPage: boolean;

    @Field(() => Cursor, { nullable: true })
    endCursor: C | null;
  }

  return PaginationObject;
};

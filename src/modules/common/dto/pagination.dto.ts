import { Field, Int, ObjectType } from '@nestjs/graphql';

export const makePaginationDto = <T, C = string>(
  prefix: string,
  Node: { new (): T },
  Cursor: typeof Int | typeof String = String,
) => {
  @ObjectType(`${prefix}PaginationEdgeDto`)
  class EdgeDto {
    @Field(() => Node)
    node: T;

    @Field(() => Cursor)
    cursor: C;
  }

  @ObjectType(`${prefix}PaginationDto`)
  class PaginationObjectDto {
    @Field(() => Int)
    total: number;

    @Field(() => [EdgeDto])
    edges: EdgeDto[];

    @Field(() => Boolean)
    hasNextPage: boolean;

    @Field(() => Cursor, { nullable: true })
    endCursor: C | null;
  }

  return PaginationObjectDto;
};

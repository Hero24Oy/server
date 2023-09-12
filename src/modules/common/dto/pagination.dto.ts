// eslint-disable-next-line max-classes-per-file
import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

export interface EdgeType<T> {
  cursor: string;
  node: T;
}

export interface PaginatedType<T> {
  edges: EdgeType<T>[];
  endCursor: string | null;
  hasNextPage: boolean;
  total: number; // Todo: it's never used
}

export function Paginated<T>(classRef: Type<T>): Type<PaginatedType<T>> {
  @ObjectType(`${classRef.name}EdgeDto`)
  abstract class EdgeType {
    @Field(() => String)
    cursor: string;

    @Field(() => classRef)
    node: T;
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedDto implements PaginatedType<T> {
    @Field(() => [EdgeType], { nullable: true })
    edges: EdgeType[];

    @Field(() => Int)
    total: number;

    @Field(() => Boolean)
    hasNextPage: boolean;

    @Field(() => String, { nullable: true })
    endCursor: string | null;
  }

  return PaginatedDto as Type<PaginatedType<T>>;
}

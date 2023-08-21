import { last } from 'lodash';
import { PaginatedType } from '../dto/pagination.dto';
import { hasNextPage } from './has-next-page.util';

type PreparePaginatedResultArgs<Node extends { id: string }> = {
  limit?: number;
  offset?: number;
  nodes: Node[];
  total: number;
};

export const preparePaginatedResult = <Node extends { id: string }>(
  args: PreparePaginatedResultArgs<Node>,
): PaginatedType<Node> => {
  const { limit, offset, nodes, total } = args;

  return {
    total,
    edges: nodes.map((node) => ({ node, cursor: node.id })),
    hasNextPage: hasNextPage({ limit, offset, total }),
    endCursor: last(nodes)?.id || null,
  };
};

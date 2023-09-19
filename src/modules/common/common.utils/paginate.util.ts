import isNumber from 'lodash/isNumber';

import { PaginationArgs } from '../dto/pagination.args';

type PaginateArgs<Node> = PaginationArgs & {
  nodes: Node[];
};

export const paginate = <Node>(args: PaginateArgs<Node>): Node[] => {
  const { limit, offset } = args;

  let nodes = [...args.nodes];

  if (isNumber(offset) && isNumber(limit)) {
    nodes = nodes.slice(offset, offset + limit);
  }

  return nodes;
};

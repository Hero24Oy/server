import { Inject, Injectable } from '@nestjs/common';

import { NEAT_FILTER_PROVIDER } from './filterer.constants';
import { NeatFilter } from './filterer.types';

@Injectable()
export class FiltererService<
  Column extends string,
  Item,
  Context,
  Configs extends Record<Column, unknown>,
> {
  constructor(
    @Inject(NEAT_FILTER_PROVIDER)
    private filters: NeatFilter<Item, Column, Context, any>[],
  ) {}

  filter(items: Item[], configs: Partial<Configs>, context: Context): Item[] {
    return items.filter((item) => {
      return this.filters.every((filter) =>
        filter.passJudgment(item, context, configs[filter.column]),
      );
    });
  }
}

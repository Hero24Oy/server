import { Inject, Injectable } from '@nestjs/common';

import { COLUMN_FILTER_PROVIDER } from './filterer.constants';
import { ColumnFilter } from './filterer.types';

@Injectable()
export class FiltererService<
  Column extends string,
  Item,
  Context,
  Configs extends Record<Column, unknown>,
> {
  constructor(
    @Inject(COLUMN_FILTER_PROVIDER)
    private readonly filters: ColumnFilter<Item, Column, Context, any>[], // eslint-disable-line @typescript-eslint/no-explicit-any -- we need any here
  ) {}

  filter(items: Item[], configs: Partial<Configs>, context: Context): Item[] {
    return items.filter((item) => {
      return this.filters.every((filter) =>
        filter.shouldLeave(item, context, configs[filter.column]),
      );
    });
  }
}

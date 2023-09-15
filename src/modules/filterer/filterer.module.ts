import { DynamicModule, Module } from '@nestjs/common';

import { COLUMN_FILTER_PROVIDER } from './filterer.constants';
import { FiltererService } from './filterer.service';
import { ColumnFilter } from './filterer.types';

@Module({
  providers: [FiltererService],
  exports: [FiltererService],
})
export class FiltererModule {
  static create<
    Column extends string,
    Item,
    Context,
    Configs extends Record<Column, unknown>,
  >(
    filters: ColumnFilter<Item, Column, Context, Configs[Column]>[],
  ): DynamicModule {
    return {
      module: FiltererModule,
      providers: [
        {
          provide: COLUMN_FILTER_PROVIDER,
          useValue: filters,
        },
        FiltererService<Column, Item, Context, Configs>,
      ],
      exports: [FiltererService<Column, Item, Context, Configs>],
    };
  }
}

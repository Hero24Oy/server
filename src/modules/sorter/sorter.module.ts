import { DynamicModule, Module } from '@nestjs/common';
import { ComparePicker } from './sorter.types';
import { COMPARE_PICKERS_PROVIDER } from './sorter.constants';
import { SorterService } from './sorter.service';

@Module({
  providers: [SorterService],
  exports: [SorterService],
})
export class SorterModule {
  static create<Column extends string, Item, Context>(
    comparePickers: Record<Column, ComparePicker<Item, Context>>,
  ): DynamicModule {
    return {
      module: SorterModule,
      providers: [
        {
          provide: COMPARE_PICKERS_PROVIDER,
          useValue: comparePickers,
        },
        SorterService<Column, Item, Context>,
      ],
      exports: [SorterService<Column, Item, Context>],
    };
  }
}

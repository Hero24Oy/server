import { Inject, Injectable } from '@nestjs/common';

import { SortOrder } from '../common/sort-order/sort-order.enum';
import { OrderInstruction, SortablePrimitives } from './sorter.types';
import { COMPARE_PICKERS_PROVIDER } from './sorter.constants';
import { ComparePicker } from './sorter.types';
import { isLess } from './sorter.utils';

@Injectable()
export class SorterService<Column extends string, Item, Context> {
  constructor(
    @Inject(COMPARE_PICKERS_PROVIDER)
    private comparePickers: Record<Column, ComparePicker<Item, Context>>,
  ) {}

  sort(
    items: Item[],
    orderInstructions: OrderInstruction<Column>[],
    context: Context,
  ): Item[] {
    const comparePrimitivesByItem = new Map<Item, SortablePrimitives[]>();

    items.forEach((item) => {
      const comparePrimitives = orderInstructions.map(({ column }) =>
        this.comparePickers[column](item, context),
      );

      comparePrimitivesByItem.set(item, comparePrimitives);
    });

    return [...items].sort((leftItem, rightItem) => {
      const leftPrimitives = comparePrimitivesByItem.get(
        leftItem,
      ) as SortablePrimitives[];

      const rightPrimitives = comparePrimitivesByItem.get(
        rightItem,
      ) as SortablePrimitives[];

      for (let idx = 0; idx < orderInstructions.length; idx++) {
        const { order } = orderInstructions[idx];

        const left = leftPrimitives[idx];
        const right = rightPrimitives[idx];

        if (isLess(left, right)) {
          return order === SortOrder.ASC ? -1 : 1;
        }

        if (isLess(right, left)) {
          return order === SortOrder.ASC ? 1 : -1;
        }
      }

      return 0;
    });
  }
}

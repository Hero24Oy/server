import { SortOrder } from '../common/sort-order/sort-order.enum';

export type SortablePrimitives = string | number;

export type OrderInstruction<Column extends string> = {
  order: SortOrder;
  column: Column;
};

export type ComparePicker<
  Item,
  Context,
  Primitive extends SortablePrimitives = SortablePrimitives,
> = (item: Item, context: Context) => Primitive;

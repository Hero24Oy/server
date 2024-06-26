/**
 * @description This structure will be used for filtration.
 * Keep in mind that config could be undefined.
 * In main cases we should return true, if config is undefined,
 * except cases when we need to provide explicit filtration
 */
export type ColumnFilter<Item, Column, Context, Config> = {
  column: Column;
  shouldLeave(item: Item, context: Context, config?: Config): boolean;
};

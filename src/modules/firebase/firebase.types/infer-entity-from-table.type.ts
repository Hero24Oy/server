import { ExtractObject } from '$/modules/common/common.types';

export type InferEntityFromTable<
  Table,
  ExtractedObject extends ExtractObject<Table> = ExtractObject<Table>,
> = ExtractedObject extends never
  ? never
  : ExtractedObject extends Record<string, unknown>
  ? ExtractedObject[string]
  : never;

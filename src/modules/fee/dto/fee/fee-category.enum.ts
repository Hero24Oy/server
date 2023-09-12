/* eslint-disable @typescript-eslint/naming-convention */
import { registerEnumType } from '@nestjs/graphql';
import { FeeCategory as FeeCategoryType } from 'hero24-types';

export const FeeCategory = {
  MATERIAL: 'material',
  SERVICE: 'service',
} satisfies Record<Uppercase<FeeCategoryType>, FeeCategoryType>;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type FeeCategory = FeeCategoryType;

registerEnumType(FeeCategory, {
  name: 'FeeCategory',
});

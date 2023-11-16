import { RecordWithDeepCapitalizeKeys } from '$types';
import { capitalize, isRecord } from '$utils';

export const convertInputToMangopayFormat = <
  PrimaryRecord extends Record<string, unknown>,
>(
  record: PrimaryRecord,
): RecordWithDeepCapitalizeKeys<PrimaryRecord> => {
  return Object.entries(record).reduce<
    RecordWithDeepCapitalizeKeys<PrimaryRecord>
  >((accumulator, [key, value]) => {
    if (isRecord(value)) {
      return {
        ...accumulator,
        [capitalize(key)]: convertInputToMangopayFormat(value),
      };
    }

    return { ...accumulator, [capitalize(key)]: value };
  }, {} as RecordWithDeepCapitalizeKeys<PrimaryRecord>);
};

import { $Keys } from 'utility-types';

export type RecordWithCapitalizeKeys<
  PrimaryRecord extends Record<string, unknown>,
> = {
  [Key in $Keys<PrimaryRecord> as Capitalize<string & Key>]: PrimaryRecord[Key];
};

export type RecordWithDeepCapitalizeKeys<
  PrimaryRecord extends Record<string, unknown>,
> = {
  [Key in $Keys<PrimaryRecord> as Capitalize<
    string & Key
  >]: PrimaryRecord[Key] extends Record<string, unknown>
    ? RecordWithCapitalizeKeys<PrimaryRecord[Key]>
    : PrimaryRecord[Key];
};

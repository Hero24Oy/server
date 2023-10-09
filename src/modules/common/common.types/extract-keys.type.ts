import { ExtractObject } from './extract-object.type';
import { Keys } from './keys.type';

export type ExtractKeys<T> = ExtractObject<T> extends never
  ? never
  : Extract<Keys<ExtractObject<T>>, string>;

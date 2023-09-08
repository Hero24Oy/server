import { Keys } from './keys.type';

export type Values<T> = T[Keys<T>];

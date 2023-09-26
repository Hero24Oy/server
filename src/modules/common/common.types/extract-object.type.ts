import { Primitive } from './primitive.type';

export type ExtractObject<T> = Exclude<T, Primitive>;

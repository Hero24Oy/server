import { MaybeType } from './common.types';

export type NullAvoided<T> = Exclude<T, undefined | null>;

export class Maybe<T> {
  constructor(private value: MaybeType<T>) {}

  public run<U>(proceed: (t: NullAvoided<T>) => MaybeType<U>): Maybe<U> {
    if (Maybe.isExist(this.value)) {
      return new Maybe(proceed(this.value));
    }

    return new Maybe<U>(null);
  }

  public val(): MaybeType<T> {
    return this.value;
  }

  public valOrDefault(defaultValue: NullAvoided<T>): NullAvoided<T> {
    return Maybe.isExist(this.value) ? this.value : defaultValue;
  }

  public async vow(): Promise<Maybe<Awaited<T>>> {
    // eslint-disable-next-line @typescript-eslint/await-thenable -- we need await here if value is promise
    return new Maybe(await this.value);
  }

  static isExist<T>(value: MaybeType<T>): value is NullAvoided<T> {
    return value !== undefined && value !== null;
  }
}

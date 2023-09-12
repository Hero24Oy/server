import { MaybeType } from './common.types';

export type NullAvoided<T> = Exclude<T, undefined | null>;

export class Maybe<Type> {
  constructor(private value: MaybeType<Type>) {}

  public run<U>(proceed: (t: NullAvoided<Type>) => MaybeType<U>): Maybe<U> {
    if (Maybe.isExist(this.value)) {
      return new Maybe(proceed(this.value));
    }

    return new Maybe<U>(null);
  }

  public val(): MaybeType<Type> {
    return this.value;
  }

  public valOrDefault(defaultValue: NullAvoided<Type>): NullAvoided<Type> {
    return Maybe.isExist(this.value) ? this.value : defaultValue;
  }

  public async vow(): Promise<Maybe<Awaited<Type>>> {
    // eslint-disable-next-line @typescript-eslint/await-thenable -- TODO: Update this type without errors
    return new Maybe(await this.value);
  }

  static isExist<Type>(value: MaybeType<Type>): value is NullAvoided<Type> {
    return value !== undefined && value !== null;
  }
}

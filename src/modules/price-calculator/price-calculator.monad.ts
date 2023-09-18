import { round } from 'lodash';

export class RoundedNumber {
  constructor(private value: number, private precision: number = 15) {}

  val() {
    return round(this.value, this.precision);
  }

  run(proceed: (value: number) => number): RoundedNumber {
    const newValue = proceed(this.val());

    return new RoundedNumber(newValue, this.precision);
  }

  add(other: RoundedNumber): RoundedNumber {
    return this.run((value) => value + other.val());
  }

  subtract(other: RoundedNumber): RoundedNumber {
    return this.run((value) => value - other.val());
  }

  multiply(other: RoundedNumber): RoundedNumber {
    return this.run((value) => value * other.val());
  }

  divide(other: RoundedNumber): RoundedNumber {
    return this.run((value) => value / other.val());
  }

  toPrecision(precision: RoundedNumber): RoundedNumber {
    return new RoundedNumber(this.val(), precision.val());
  }

  static of(value: number, precision?: number) {
    return new RoundedNumber(value, precision);
  }
}

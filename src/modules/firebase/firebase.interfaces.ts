import { assign } from 'lodash';
import { RecordType, TypeSafeRequired } from '../common/common.types';
import { omitUndefined } from '../common/common.utils';

const INITIALIZED_KEY = Symbol('initialized');

export abstract class FirebaseGraphQLAdapter<
  Shape extends RecordType,
  FirebaseT extends RecordType,
  // eslint-disable-next-line @typescript-eslint/ban-types
  ExpandT extends RecordType = {},
> {
  constructor(shape?: Shape) {
    shape && this.assignData(shape);
  }

  private [INITIALIZED_KEY] = false;

  protected abstract toFirebaseType(): TypeSafeRequired<FirebaseT>;
  protected abstract fromFirebaseType(
    firebase: FirebaseT & ExpandT,
  ): TypeSafeRequired<Shape>;

  public toFirebase(): FirebaseT {
    if (!this[INITIALIZED_KEY]) {
      throw new Error(
        'You should fill data via constructor(data) or fromFirebase(data) before toFirebase() call',
      );
    }

    return omitUndefined(this.toFirebaseType()) as FirebaseT;
  }

  public fromFirebase(firebase: FirebaseT & ExpandT): this {
    const shape = this.fromFirebaseType(firebase);

    this.assignData(shape);

    return this;
  }

  private assignData(shape: TypeSafeRequired<Shape>) {
    assign(this, shape);
    this[INITIALIZED_KEY] = true;
  }
}

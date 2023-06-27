import { assign } from 'lodash';
import { RecordType, TypeSafeRequired } from '../common/common.types';
import { omitUndefined } from '../common/common.utils';

export abstract class FirebaseGraphQLAdapter<
  Shape extends RecordType,
  FirebaseT extends RecordType,
  // eslint-disable-next-line @typescript-eslint/ban-types
  ExpandT extends RecordType = {},
> {
  constructor(shape?: Shape) {
    if (!shape) {
      return;
    }

    assign(this, shape);
  }

  protected abstract toFirebaseType(): TypeSafeRequired<FirebaseT>;
  protected abstract fromFirebaseType(
    firebase: FirebaseT & ExpandT,
  ): TypeSafeRequired<Shape>;

  public toFirebase(): FirebaseT {
    return omitUndefined(this.toFirebaseType()) as FirebaseT;
  }

  public fromFirebase(firebase: FirebaseT & ExpandT): this {
    const shape = this.fromFirebaseType(firebase);

    assign(this, shape);

    return this;
  }
}

import { assign } from 'lodash';
import { TypeSafeRequired } from '../common/common.types';
import { omitUndefined } from '../common/common.utils';

type ObjectType = Record<string | symbol | number, any>;

export abstract class FirebaseGraphQLAdapter<
  Shape extends ObjectType,
  FirebaseT extends ObjectType,
  // eslint-disable-next-line @typescript-eslint/ban-types
  ExpandT extends ObjectType = {},
> {
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

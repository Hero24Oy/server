import { omitUndefined } from '../common/common.utils';

type FirebaseObject = Record<string | symbol | number, any>;

export abstract class FirebaseGraphQLAdapter<
  FirebaseT extends FirebaseObject,
  ExpandT extends FirebaseObject = Record<string, never>,
> {
  protected abstract toFirebaseType(): FirebaseT;
  protected abstract fromFirebaseType(shape: FirebaseT & ExpandT): this;

  public toFirebase(): FirebaseT {
    return omitUndefined(this.toFirebaseType());
  }
  public fromFirebase(shape: FirebaseT & ExpandT): this {
    return this.fromFirebaseType(shape);
  }
}

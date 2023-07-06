import { Adapter } from '../common/adapter/adapter.interface';
import { TypeSafeRequired } from '../common/common.types';
import { omitUndefined } from '../common/common.utils';

export class FirebaseAdapter<FirebaseType, DtoType>
  implements Adapter<TypeSafeRequired<FirebaseType>, TypeSafeRequired<DtoType>>
{
  constructor(
    private readonly adapter: Adapter<
      TypeSafeRequired<FirebaseType>,
      TypeSafeRequired<DtoType>
    >,
  ) {}

  public toInternal(external: DtoType): TypeSafeRequired<FirebaseType> {
    return omitUndefined(this.adapter.toInternal(external)) as FirebaseType;
  }

  public toExternal(internal: FirebaseType): TypeSafeRequired<DtoType> {
    return this.adapter.toExternal(internal);
  }
}

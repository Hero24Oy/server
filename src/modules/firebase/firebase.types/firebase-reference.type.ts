import { Reference } from 'firebase-admin/database';

import { FirebaseQuery } from './firebase-query.type';
// eslint-disable-next-line import/no-cycle -- Firebase Reference is required in Firebase Thenable Reference and vice versa
import { FirebaseThenableReference } from './firebase-thenable-reference.type';

import { ExtractKeys, ExtractObject } from '$/modules/common/common.types';

type QueryFields = keyof FirebaseQuery<unknown>;
type OverriddenFields = 'child' | 'push' | 'remove' | 'set' | 'update';

export interface FirebaseReference<Entity>
  extends FirebaseQuery<Entity>,
    Omit<Reference, QueryFields | OverriddenFields> {
  child<Field extends ExtractKeys<Entity>>(
    field: Field,
  ): FirebaseReference<ExtractObject<Entity>[Field]>;

  push<
    Item = ExtractObject<Entity> extends never
      ? never
      : ExtractObject<Entity> extends Record<string, unknown>
      ? ExtractObject<Entity>[string]
      : never,
  >(
    value?: Item,
  ): FirebaseThenableReference<Item>;

  remove(): Promise<void>;

  set(value: Exclude<Entity, undefined>): Promise<void>;

  update(
    values: ExtractObject<Entity> extends never
      ? never
      : Partial<ExtractObject<Entity>>,
  ): Promise<void>;
}

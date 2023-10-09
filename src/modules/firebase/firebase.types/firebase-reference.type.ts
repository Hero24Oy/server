import { Reference } from 'firebase-admin/database';

// eslint-disable-next-line import/no-cycle -- Firebase Reference is required in Firebase Query and vice versa
import { FirebaseQuery } from './firebase-query.type';
import { FirebaseSnapshot } from './firebase-snapshot.type';
// eslint-disable-next-line import/no-cycle -- Firebase Reference is required in Firebase Thenable Reference and vice versa
import { FirebaseThenableReference } from './firebase-thenable-reference.type';
import { FirebaseTransactionResult } from './firebase-transaction-result.type';
import { InferEntityFromTable } from './infer-entity-from-table.type';

import {
  ExtractKeys,
  ExtractObject,
  Keys,
} from '$/modules/common/common.types';

interface OverriddenReference<Entity> extends FirebaseQuery<Entity> {
  child<Field extends ExtractKeys<Entity>>(
    field: Field,
  ): FirebaseReference<ExtractObject<Entity>[Field]>;

  parent: FirebaseReference<Record<string, Entity>> | null;

  push<Item extends InferEntityFromTable<Entity>>(
    value?: Item,
  ): FirebaseThenableReference<Item>;

  remove(): Promise<void>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- todo: remove it during refactoring
  root: FirebaseReference<any>;

  set(value: Exclude<Entity, undefined>): Promise<void>;

  transaction(
    transactionUpdate: (snapshot: Entity | null) => Entity | null | undefined,
    onComplete?: (
      error: Error | null,
      committed: boolean,
      snapshot: FirebaseSnapshot<Entity> | null,
    ) => void,
    applyLocally?: boolean,
  ): Promise<FirebaseTransactionResult<Entity>>;

  update(values: Partial<ExtractObject<Entity>>): Promise<void>;
}

type OverriddenFields =
  | Keys<OverriddenReference<unknown>>
  | keyof FirebaseQuery<unknown>;

export type FirebaseReference<Entity> = Omit<Reference, OverriddenFields> &
  OverriddenReference<Entity>;

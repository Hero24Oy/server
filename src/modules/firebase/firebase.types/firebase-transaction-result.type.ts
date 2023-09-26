import { FirebaseSnapshot } from './firebase-snapshot.type';

export type FirebaseTransactionResult<Entity> = {
  committed: boolean;
  snapshot: FirebaseSnapshot<Entity>;
};

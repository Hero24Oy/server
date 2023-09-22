import { FirebaseSnapshot } from './firebase-snapshot.type';

export type FirebaseEventCallback<Entity> = (
  snapshot: FirebaseSnapshot<Entity>,
) => void;

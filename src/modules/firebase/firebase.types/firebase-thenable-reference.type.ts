// eslint-disable-next-line import/no-cycle -- Firebase Reference is required in Firebase Thenable Reference and vice versa
import { FirebaseReference } from './firebase-reference.type';

export interface FirebaseThenableReference<Entity>
  extends FirebaseReference<Entity>,
    Pick<Promise<FirebaseReference<Entity>>, 'then' | 'catch'> {}

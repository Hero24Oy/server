import { DataSnapshot, EventType } from 'firebase-admin/database';

import { FirebaseQuery } from './firebase.types';

export const subscribeOnFirebaseEvent = <Entity>(
  ref: FirebaseQuery<Entity>,
  eventType: EventType,
  eventHandler: (snapshot: DataSnapshot) => void,
) => {
  ref.on(eventType, eventHandler);

  return () => ref.off(eventType);
};

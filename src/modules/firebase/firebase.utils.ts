import { EventType } from 'firebase-admin/database';

import { FirebaseEventCallback, FirebaseQuery } from './firebase.types';

export const subscribeOnFirebaseEvent = <Entity, Event extends EventType>(
  ref: FirebaseQuery<Entity>,
  eventType: Event,
  eventHandler: FirebaseEventCallback<Event, Entity>,
): (() => void) => {
  ref.on(eventType, eventHandler);

  return () => ref.off(eventType, eventHandler);
};

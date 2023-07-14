import {
  DataSnapshot,
  EventType,
  Query,
  Reference,
} from 'firebase-admin/database';

export const subscribeOnFirebaseEvent = (
  ref: Reference | Query,
  eventType: EventType,
  eventHandler: (snapshot: DataSnapshot) => void,
) => {
  ref.on(eventType, eventHandler);

  return () => ref.off(eventType);
};

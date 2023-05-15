import { DataSnapshot, EventType, Reference } from 'firebase-admin/database';

export const subscribeOnFirebaseEvent = (
  ref: Reference,
  eventType: EventType,
  eventHandler: (snapshot: DataSnapshot) => void,
) => {
  ref.on(eventType, eventHandler);

  return () => ref.off(eventType);
};

// We cannot do this with Record<string, Entity> because of circular dependency error.
export type Entity = { [key: string]: Entity | string };

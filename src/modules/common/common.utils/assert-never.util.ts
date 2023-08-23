export function assertNever(value: never): never {
  throw new Error(`Wrong type of ${value}`);
}

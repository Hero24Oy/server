export function assertNever(value: never): never {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions -- we don't see this error
  throw new Error(`Wrong type of ${value}`);
}

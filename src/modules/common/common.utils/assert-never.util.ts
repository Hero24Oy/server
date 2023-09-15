export function assertNever(value: never): never {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions -- this error will not be thrown
  throw new Error(`Wrong type of ${value}`);
}

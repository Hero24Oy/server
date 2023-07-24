export const skipFirst = <Fn extends (...args: unknown[]) => void>(fn: Fn) => {
  let first = true;

  return (...args: Parameters<Fn>) => {
    if (first) {
      first = false;
      return;
    }

    return fn(...args);
  };
};

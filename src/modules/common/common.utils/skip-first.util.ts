export const skipFirst = <Fn extends (...args: unknown[]) => void>(fn: Fn) => {
  let isFirst = true;

  return (...args: Parameters<Fn>) => {
    if (isFirst) {
      isFirst = false;

      return;
    }

    return fn(...args);
  };
};

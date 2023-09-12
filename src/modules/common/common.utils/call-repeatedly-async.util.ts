export const callRepeatedlyAsync = async (
  handler: () => Promise<unknown>,
  condition: (error: Error) => boolean,
  step: number,
) => {
  try {
    return await handler();
  } catch (error: unknown) {
    if (condition(error as Error) && step > 1) {
      return callRepeatedlyAsync(handler, condition, step - 1);
    }

    throw error;
  }
};

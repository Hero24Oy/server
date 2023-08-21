export const callRepeatedlyAsync = async (
  handler: () => Promise<unknown>,
  condition: (error: Error) => boolean,
  step: number,
) => {
  try {
    return await handler();
  } catch (error) {
    if (condition(error) && step > 1) {
      return callRepeatedlyAsync(handler, condition, step - 1);
    }

    throw error;
  }
};

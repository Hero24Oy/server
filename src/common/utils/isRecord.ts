export const isRecord = (value: unknown): value is Record<string, unknown> => {
  return (
    typeof value === 'object' &&
    !Array.isArray(value) &&
    value !== null &&
    Object.keys(value).length > 0
  );
};

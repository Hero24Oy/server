export const getPreviousFetchDate = (days: number): Date => {
  const today = new Date();

  return new Date(today.getDate() - days);
};

export const getPreviousFetchDate = (days: number) => {
  const today = new Date();

  return new Date(today.getDate() - days);
};

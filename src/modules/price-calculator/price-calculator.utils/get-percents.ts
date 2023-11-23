// TODO tests
export const getPercents = (amount: number, percents: number): number => {
  // eslint-disable-next-line no-magic-numbers -- 100 is percents
  return (amount * percents) / 100;
};

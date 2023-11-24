export const getValueBeforeVatApplied = (
  value: number,
  percents: number,
  // eslint-disable-next-line no-magic-numbers -- 100 represents percents
): number => value / (1 + percents / 100);

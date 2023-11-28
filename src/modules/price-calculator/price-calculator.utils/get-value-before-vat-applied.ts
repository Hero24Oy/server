export const getValueBeforeVatApplied = (
  value: number,
  percents: number,
): number => value / (1 + percents / 100);

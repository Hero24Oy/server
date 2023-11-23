// TODO tests
/**
 * @param amount The net amount to calculate VAT from
 * @param vatPercentage Amount of percents for vat. [0-100]
 * @returns initial amount with vat subtracted
 */
export const getValueWithVatApplied = (
  amount: number,
  vatPercentage: number,
): number => {
  // eslint-disable-next-line no-magic-numbers -- 100 is percents
  const vatAmount = (amount * vatPercentage) / 100;

  const amountWithVatApplied = amount - vatAmount;

  return amountWithVatApplied;
};

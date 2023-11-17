export type TransactionParams = {
  amount: number;
  author: string;
  fee: number;
  transfer: {
    from: string;
    to: string;
  };
};

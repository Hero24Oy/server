export type TransactionParameters = {
  amount: number;
  author: string;
  fee: number;
  transfer: {
    from: string;
    to: string;
  };
};

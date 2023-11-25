export type TransactionParameters = {
  amount: number;
  authorId: string;
  fee: number;
  transfer: {
    from: string;
    to: string;
  };
};

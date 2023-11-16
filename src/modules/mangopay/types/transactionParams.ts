export type TransactionParams = {
  amount: number;
  author: string;
  fee: number;
  wallets: {
    from: string;
    to: string;
  };
};

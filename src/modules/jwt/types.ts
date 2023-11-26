export type SignJwtParams<Data extends Record<string, unknown>> = {
  data: Data;
  secret: string;
  expiresIn?: number;
};

export type VerifyJwtParams = {
  secret: string;
  token: string;
};

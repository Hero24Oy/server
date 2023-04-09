import { Request, Response } from 'express';

export type AppGqlContext = {
  req: Request;
  res: Response;
};

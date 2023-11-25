import { uboDeclaration as MangopayUboDeclaration } from 'mangopay2-nodejs-sdk';

import { Ubo } from './ubo';

export type CreateUboParameters = {
  data: MangopayUboDeclaration.CreateUbo;
} & Ubo;

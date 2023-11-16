import { Injectable } from '@nestjs/common';
import MangopayApi from 'mangopay2-nodejs-sdk';

import { ConfigType } from '$config';
import { Config } from '$decorator';

@Injectable()
export class MangopayInstanceService {
  protected readonly api: MangopayApi;

  constructor(@Config() config: ConfigType) {
    this.api = new MangopayApi(config.mangopay);
  }
}

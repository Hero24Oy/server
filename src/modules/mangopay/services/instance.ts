import { Injectable } from '@nestjs/common';
import MangopayApi from 'mangopay2-nodejs-sdk';

import { ConfigType } from '$config';
import { Config } from '$decorator';

@Injectable()
export class MangopayInstanceService extends MangopayApi {
  constructor(@Config() config: ConfigType) {
    super(config.mangopay);
  }
}

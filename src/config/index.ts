import { ConfigType as NestJsConfigType, registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import app, { appValidationSchema } from './app';
import firebase, { firebaseValidationSchema } from './firebase';
import hubSpot, { hubSpotValidationSchema } from './hubSpot';
import visma, { vismaValidationSchema } from './visma';

export const configValidationSchema = Joi.object()
  .concat(appValidationSchema)
  .concat(firebaseValidationSchema)
  .concat(hubSpotValidationSchema)
  .concat(vismaValidationSchema);

const config = {
  app: app(),
  firebase: firebase(),
  hubSpot: hubSpot(),
  visma: visma(),
};

const registerConfig = registerAs('config', () => config);

export type ConfigType = NestJsConfigType<typeof registerConfig>;

export const CONFIG_PROVIDER = registerConfig.KEY;

export default registerConfig;

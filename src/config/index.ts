import { ConfigType as NestJsConfigType, registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import app, { appValidationSchema } from './app';
import firebase, { firebaseValidationSchema } from './firebase';
import hubSpot, { hubSpotValidationSchema } from './hubSpot';

export const configValidationSchema = Joi.object()
  .concat(appValidationSchema)
  .concat(firebaseValidationSchema)
  .concat(hubSpotValidationSchema);

const getConfig = () => ({
  app: app(),
  firebase: firebase(),
  hubSpot: hubSpot(),
});

const registerConfig = registerAs('config', getConfig);

export type ConfigType = NestJsConfigType<typeof registerConfig>;

export const CONFIG_PROVIDER = registerConfig.KEY;

export default registerConfig;

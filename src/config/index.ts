import { ConfigType, registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import app, { appValidationSchema } from './app';
import firebase, { firebaseValidationSchema } from './firebase';
import hubSpot, { hubSpotValidationSchema } from './hubSpot';

export const configValidationSchema = Joi.object()
  .concat(appValidationSchema)
  .concat(firebaseValidationSchema)
  .concat(hubSpotValidationSchema);

const config = {
  app: app(),
  firebase: firebase(),
  hubSpot: hubSpot(),
};

const registerConfig = registerAs('config', () => config);

export type Config = ConfigType<typeof registerConfig>;

export const configProvider = registerConfig.KEY;

export default registerConfig;

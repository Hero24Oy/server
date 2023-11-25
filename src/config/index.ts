import { ConfigType as NestJsConfigType, registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import app, { appValidationSchema } from './app';
import firebase, { firebaseValidationSchema } from './firebase';
import hubSpot, { hubSpotValidationSchema } from './hubSpot';
import mangopay, { mangopayValidationSchema } from './mangopay';
import netvisor, { netvisorValidationSchema } from './netvisor';

export const configValidationSchema = Joi.object()
  .concat(appValidationSchema)
  .concat(firebaseValidationSchema)
  .concat(hubSpotValidationSchema)
  .concat(netvisorValidationSchema)
  .concat(mangopayValidationSchema);

const getConfig = () => ({
  app: app(),
  firebase: firebase(),
  hubSpot: hubSpot(),
  netvisor: netvisor(),
  mangopay: mangopay(),
});

const registerConfig = registerAs('config', getConfig);

export type ConfigType = NestJsConfigType<typeof registerConfig>;

export const CONFIG_PROVIDER = registerConfig.KEY;

export default registerConfig;

import * as Joi from 'joi';
import app, { appValidationSchema } from './app';

export const configValidationSchema = Joi.object().concat(appValidationSchema);

export default () => ({
  app: app(),
});

import * as Joi from 'joi';
import app, { appValidationSchema } from './app';
import firebase, { firebaseValidationSchema } from './firebase';
import n8n, { n8nValidationSchema } from './n8n';

export const configValidationSchema = Joi.object()
  .concat(appValidationSchema)
  .concat(firebaseValidationSchema)
  .concat(n8nValidationSchema);

export default () => ({
  app: app(),
  firebase: firebase(),
  n8n: n8n(),
});

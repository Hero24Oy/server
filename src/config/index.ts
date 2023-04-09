import * as Joi from 'joi';
import app, { appValidationSchema } from './app';
import firebase, { firebaseValidationSchema } from './firebase';

export const configValidationSchema = Joi.object()
  .concat(appValidationSchema)
  .concat(firebaseValidationSchema);

export default () => ({
  app: app(),
  firebase: firebase(),
});

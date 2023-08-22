import * as Joi from 'joi';
import app, { appValidationSchema } from './app';
import firebase, { firebaseValidationSchema } from './firebase';
import hubSpot, { hubSpotValidationSchema } from './hubSpot';

export const configValidationSchema = Joi.object()
  .concat(appValidationSchema)
  .concat(firebaseValidationSchema)
  .concat(hubSpotValidationSchema);

export default () => ({
  app: app(),
  firebase: firebase(),
  hubSpot: hubSpot(),
});

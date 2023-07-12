import * as Joi from 'joi';
import app, { appValidationSchema } from './app';
import firebase, { firebaseValidationSchema } from './firebase';
import n8n, { n8nValidationSchema } from './n8n';
import hubSpot, { hubSpotValidationSchema } from './hubSpot';

export const configValidationSchema = Joi.object()
  .concat(appValidationSchema)
  .concat(firebaseValidationSchema)
  .concat(n8nValidationSchema)
  .concat(hubSpotValidationSchema);

export default () => ({
  app: app(),
  firebase: firebase(),
  hubSpot: hubSpot(),
  n8n: n8n(),
});

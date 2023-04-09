import * as Joi from 'joi';

export const firebaseValidationSchema = Joi.object({
  FIREBASE_DATABASE_URL: Joi.string().required(),
});

export default () => ({
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

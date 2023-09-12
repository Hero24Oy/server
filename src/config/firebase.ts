import * as Joi from 'joi';

export const firebaseValidationSchema = Joi.object({
  FIREBASE_PROJECT_ID: Joi.string().required(),
  FIREBASE_DATABASE_URL: Joi.string().required(),
  FIREBASE_SERVICE_ACCOUNT_TYPE: Joi.string().required(),
  FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID: Joi.string().required(),
  FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY: Joi.string().required(),
  FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL: Joi.string().required(),
  FIREBASE_SERVICE_ACCOUNT_CLIENT_ID: Joi.string().required(),
  FIREBASE_SERVICE_ACCOUNT_AUTH_URI: Joi.string().required(),
  FIREBASE_SERVICE_ACCOUNT_TOKEN_URI: Joi.string().required(),
  FIREBASE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL: Joi.string().required(),
  FIREBASE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL: Joi.string().required(),
  FIREBASE_CLIENT_API_KEY: Joi.string().required(),
  FIREBASE_CLIENT_AUTH_DOMAIN: Joi.string().required(),
  FIREBASE_CLIENT_STORAGE_BUCKET: Joi.string().required(),
  FIREBASE_CLIENT_MESSAGING_SENDER_ID: Joi.string().required(),
  FIREBASE_CLIENT_FUNCTIONS_URL: Joi.string().required(),
});

export default () => ({
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  serviceAccount: {
    type: process.env.FIREBASE_SERVICE_ACCOUNT_TYPE,
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKeyId: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
    privateKey: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
      /\\n/g,
      '\n',
    ),
    clientEmail: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    clientId: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_ID,
    authUri: process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_URI,
    tokenUri: process.env.FIREBASE_SERVICE_ACCOUNT_TOKEN_URI,
    authProviderX509CertUrl:
      process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
    clientX509CertUrl:
      process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
  },
  clientSdk: {
    apiKey: process.env.FIREBASE_CLIENT_API_KEY,
    authDomain: process.env.FIREBASE_CLIENT_API_KEY,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_CLIENT_API_KEY,
    messagingSenderId: process.env.FIREBASE_CLIENT_API_KEY,
    functionsUrl: process.env.FIREBASE_CLIENT_API_KEY,
  },
});

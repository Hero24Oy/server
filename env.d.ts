declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Base
      NODE_ENV: 'production' | 'development';

      // App
      PORT: string;

      // Firebase Common
      FIREBASE_PROJECT_ID: string;

      FIREBASE_DATABASE_URL: string;

      // Firebase Admin SDK
      FIREBASE_SERVICE_ACCOUNT_TYPE: string;
      FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID: string;
      FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY: string;
      FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL: string;
      FIREBASE_SERVICE_ACCOUNT_CLIENT_ID: string;
      FIREBASE_SERVICE_ACCOUNT_AUTH_URI: string;
      FIREBASE_SERVICE_ACCOUNT_TOKEN_URI: string;
      FIREBASE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL: string;
      FIREBASE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL: string;

      // Firebase Client SDK
      FIREBASE_CLIENT_API_KEY: string;
      FIREBASE_CLIENT_AUTH_DOMAIN: string;
      FIREBASE_CLIENT_STORAGE_BUCKET: string;
      FIREBASE_CLIENT_MESSAGING_SENDER_ID: string;
      FIREBASE_CLIENT_FUNCTIONS_URL: string;

      // HubSpot service
      HUB_SPOT_ACCESS_TOKEN: string;
      HUB_SPOT_DEAL_OWNER_ID: string;
      HUB_SPOT_DISABLED: 'true' | 'false';

      // Netvisor
      NETVISOR_BASE_URL: string;
      NETVISOR_ORG_ID: string;
      NETVISOR_CUSTOMER_ID: string;
      NETVISOR_CUSTOMER_KEY: string;
      NETVISOR_PARTNER_ID: string;
      NETVISOR_PARTNER_KEY: string;
      NETVISOR_SENDER: string;
      NETVISOR_FETCH_CRON: string;

      // Mangopay
      MANGOPAY_BASE_URL: string;
      MANGOPAY_CLIENT_ID: string;
      MANGOPAY_API_KEY: string;
      MANGOPAY_PAYMENT_LINK_SECRET: string;
      MANGOPAY_LINK_EXPIRATION_TIME: string;
    }
  }
}

export {};

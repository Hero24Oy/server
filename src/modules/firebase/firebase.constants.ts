export const FIREBASE_APP_IN_REQUEST_PATH = Symbol('AppInRequestPath');

export enum FirebaseDatabasePath {
  USERS = 'users',
  BUYER_PROFILES = 'buyerProfiles',
  SELLER_PROFILES = 'sellerProfiles',
  APPROVED_SELLERS = 'approvedSellers',
  OFFER_REQUESTS = 'offerRequests',
}

export const FIREBASE_APP_IN_REQUEST_PATH = Symbol('AppInRequestPath');
export const FIREBASE_USER_IN_REQUEST_PATH = Symbol('UserInRequestPath');

export enum FirebaseDatabasePath {
  USERS = 'users',
  BUYER_PROFILES = 'buyerProfiles',
  SELLER_PROFILES = 'sellerProfiles',
  APPROVED_SELLERS = 'approvedSellers',
  OFFER_REQUESTS = 'offerRequests',
  OFFER_REQUEST_ACCEPTANCE_GUARDS = 'offerRequestAcceptanceGuards',
  OPEN_OFFER_REQUESTS = 'openOfferRequests',
  CHATS = 'chats',
  CHAT_MESSAGES = 'chatMessages',
  ADMIN_USERS = 'adminUsers',
  NEWS = 'news',
  SETTINGS = 'settings',
  OFFERS = 'offers',
  USER_MERGES = 'userMerges',
  FEES = 'fees',
  IMAGES = 'images',
  REVIEWS = 'reviews',
  CATEGORY_GROUP = 'feed',
  HERO_PORTFOLIOS = 'heroPortfolios',
}

export const MAX_TRYING_COUNT = 3;

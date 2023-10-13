import { REVIEW_CREATED_SUBSCRIPTION } from '../constants';
import { ReviewObject, SubscribeToReviewCreateInput } from '../graphql';

type UserSubscriptionType = typeof REVIEW_CREATED_SUBSCRIPTION;

type Payload = Record<UserSubscriptionType, ReviewObject>;

export const ReviewCreateSubscriptionFilter =
  (type: UserSubscriptionType) =>
  (payload: Payload, { input }: { input: SubscribeToReviewCreateInput }) => {
    const review = payload[type];

    return review.sellerProfileId === input.filter.sellerId;
  };

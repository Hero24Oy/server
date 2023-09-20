import { ReviewDto } from '../dto/review/review.dto';
import { SubscribeToReviewUpdateInput } from '../dto/review/subscribe-to-review-update.input';
import { REVIEW_UPDATED_SUBSCRIPTION } from '../review.constants';

type UserSubscriptionType = typeof REVIEW_UPDATED_SUBSCRIPTION;

type Payload = Record<UserSubscriptionType, ReviewDto>;

export const ReviewSubscriptionFilter =
  (type: UserSubscriptionType) =>
  (payload: Payload, { input }: { input: SubscribeToReviewUpdateInput }) => {
    const review = payload[type];

    if (!input.filter.ids?.includes(review.id)) {
      return false;
    }

    return true;
  };

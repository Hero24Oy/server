import { REVIEW_UPDATED_SUBSCRIPTION } from '../review.constants';
import { ReviewDto } from '../dto/review/review.dto';
import { ReviewFilterInput } from '../dto/review/review-filter.input';

type UserSubscriptionType = typeof REVIEW_UPDATED_SUBSCRIPTION;

type Payload = Record<UserSubscriptionType, ReviewDto>;

export const ReviewSubscriptionFilter =
  (type: UserSubscriptionType) =>
  (payload: Payload, { filter }: { filter: ReviewFilterInput }) => {
    const review = payload[type];

    if (!filter.ids?.includes(review.id)) {
      return false;
    }

    return true;
  };

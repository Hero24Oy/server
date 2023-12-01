import { registerEnumType } from '@nestjs/graphql';

import { KycType } from '$modules/mangopay/enums';

export const kycTypeEnum = registerEnumType(KycType, {
  name: 'KycType',
});

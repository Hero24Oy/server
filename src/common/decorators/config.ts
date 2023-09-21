import { Inject } from '@nestjs/common';

import { configProvider } from '$config';

export const Config = () => Inject(configProvider);

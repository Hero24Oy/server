import { Inject } from '@nestjs/common';

import { CONFIG_PROVIDER } from '$config';

export const Config = () => Inject(CONFIG_PROVIDER);

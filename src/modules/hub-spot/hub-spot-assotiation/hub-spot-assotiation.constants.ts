/* eslint-disable @typescript-eslint/naming-convention */
import { AssociationSpecWithLabelCategoryEnum } from '@hubspot/api-client/lib/codegen/crm/associations/v4';
import { Values } from 'src/modules/common/common.types';

export const AssociationCategory = {
  HUB_SPOT_DEFINED: 'HUBSPOT_DEFINED',
  INTEGRATOR_DEFINED: 'INTEGRATOR_DEFINED',
  USER_DEFINED: 'USER_DEFINED',
} satisfies Record<string, AssociationSpecWithLabelCategoryEnum>;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AssociationCategory = Values<typeof AssociationCategory>;

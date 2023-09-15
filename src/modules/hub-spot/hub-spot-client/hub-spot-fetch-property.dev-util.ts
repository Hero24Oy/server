import { Client as HubSpotClient } from '@hubspot/api-client';
import fs from 'fs';

import { capitalize } from '$imports/lodash';

const notStringAndNotNumberRegexp = /[^a-zA-Z0-9]/g;
const multipleUnderscoreRegexp = /_+/g;
const firstOrLatestUnderscoreRegexp = /(^_)|(_$)/g;

const prepareLabel = (label: string): string => {
  return label
    .toUpperCase()
    .replace(notStringAndNotNumberRegexp, '_')
    .replace(multipleUnderscoreRegexp, '_')
    .replace(firstOrLatestUnderscoreRegexp, '');
};

const serializeEnum = (enumName: string, record: Record<string, string>) => {
  const capitalized = capitalize(enumName);

  return `export enum HubSpot${capitalized}Property {
  ${Object.entries(record)
    .sort(([lhs], [rhs]) => lhs.localeCompare(rhs))
    .map(([label, name]) => `${label} = "${name}",`)
    .join('\n  ')}
}
`;
};

const print = (path: string, data: string) => {
  return new Promise((resolve) => {
    fs.writeFile(path, data, 'utf-8', resolve);
  });
};

type CreatePropertiesEnum = {
  hubSpotClient: HubSpotClient;
  hubSpotObjectType: string;
  saveFilePath: string;
};

/**
 * @description
 * __dev__createPropertiesEnum could be used to generate enum for
 * hub-spot properties to a particular object: deal, contact, etc.
 * Keep in mind, that file will be created in the dist dir.
 * You can see path in console.
 * @description Don't use it on prod. Just copy-paste enum or file.
 * @example
 * __dev__createPropertiesEnum({
 *  saveFilePath: path.join(__dirname, 'deal.ts'),
 *  hubSpotClient: this.client,
 *   hubSpotObjectType: 'deal',
 * });
 */
export const __dev__createPropertiesEnum = async ({
  saveFilePath,
  hubSpotObjectType,
  hubSpotClient,
}: CreatePropertiesEnum): Promise<void> => {
  const { results } = await hubSpotClient.crm.properties.coreApi.getAll(
    hubSpotObjectType,
  );

  const uniqChecker = new Map<string, number>();

  const enumObject = Object.fromEntries(
    results.map(({ name, label }) => {
      let preparedLabel = prepareLabel(label);
      const count = uniqChecker.get(preparedLabel) || 0;

      if (count > 0) {
        preparedLabel += `_${count}`;
      }

      uniqChecker.set(preparedLabel, count + 1);

      return [preparedLabel, name];
    }),
  );

  const enumString = serializeEnum(hubSpotObjectType, enumObject);

  await print(saveFilePath, enumString);

  // eslint-disable-next-line no-console -- we need console log here
  console.log(`Enum was successful created by path ${saveFilePath}`);
};

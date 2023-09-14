import { exec } from 'child_process';
import semver from 'semver';

import { engines } from '../package.json';

const { node: EXPECTED_NODE_VERSION, npm: EXPECTED_NPM_VERSION } = engines;
const ACTUAL_NODE_VERSION = process.version;

exec('npm -v', (_error, stdout) => {
  const actualNpmVersion = stdout;

  if (!semver.satisfies(actualNpmVersion, EXPECTED_NPM_VERSION)) {
    throw new Error(
      `The current npm version ${actualNpmVersion} does not satisfy the required version ${EXPECTED_NPM_VERSION} .`,
    );
  }
});

if (!semver.satisfies(ACTUAL_NODE_VERSION, EXPECTED_NODE_VERSION)) {
  throw new Error(
    `The current node version ${ACTUAL_NODE_VERSION} does not satisfy the required version ${EXPECTED_NODE_VERSION} .`,
  );
}

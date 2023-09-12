import fs from 'fs';
import path from 'path';

fs.readFile(path.join(__dirname, '../.nvmrc'), 'utf8', (error, data) => {
  if (error) {
    throw error;
  }

  const expectedVersion = data.trim().replace('v', '');
  const currentVersion = process.version.replace('v', '');

  const isVersionMatchesExactly = expectedVersion === currentVersion;

  const isVersionMatchesMajor =
    expectedVersion.split('.')[0] === currentVersion.split('.')[0];

  if (isVersionMatchesExactly) {
    process.exit();
  }

  const nvmInstallText =
    'To do this you can install nvm (https://github.com/nvm-sh/nvm) then run `nvm install`.';

  if (isVersionMatchesMajor) {
    console.warn(
      `Warning: You are using Node.js version ${currentVersion} which we do not use.\n\nYou may encounter issues, consider installing Node.js version ${expectedVersion} \n\n ${nvmInstallText}`,
    );
    process.exit();
  }

  console.error(
    `You are using Node.js version ${currentVersion} which we do not support. \n\n Please install Node.js version ${expectedVersion} and try again. \n\n ${nvmInstallText}`,
  );
  process.exit(1); // exit with a failure mode
});

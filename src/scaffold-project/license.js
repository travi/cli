import fs from 'mz/fs';
import chalk from 'chalk';
import spdxLicenseList from 'spdx-license-list/full';

export default async function ({projectRoot, license}) {
  if (license) {
    console.log(chalk.blue('Generating License'));     // eslint-disable-line no-console

    await fs.writeFile(`${projectRoot}/LICENSE`, `${spdxLicenseList[license].licenseText}\n`.replace(/\n/gm, '\n\n'));
  }
}

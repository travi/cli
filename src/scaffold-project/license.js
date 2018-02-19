import fs from 'mz/fs';
import chalk from 'chalk';
import mustache from 'mustache';
import spdxLicenseList from 'spdx-license-list/full';

export default async function ({projectRoot, license, copyright}) {
  if (license) {
    console.log(chalk.blue('Generating License'));     // eslint-disable-line no-console

    mustache.tags = ['<', '>'];

    await fs.writeFile(
      `${projectRoot}/LICENSE`,
      mustache.render(`${spdxLicenseList[license].licenseText}\n`.replace(/\n/gm, '\n\n'), {
        year: copyright.year,
        'copyright holders': copyright.holder
      })
    );
  }
}

import fs from 'mz/fs';
import chalk from 'chalk';
import mustache from 'mustache';
import spdxLicenseList from 'spdx-license-list/full';

function buildLicenseBadge(vcs) {
  return (vcs && 'GitHub' === vcs.host) && `https://img.shields.io/github/license/${vcs.owner}/${vcs.name}.svg`;
}

export default async function ({projectRoot, license, copyright, vcs}) {
  if (license) {
    console.log(chalk.blue('Generating License'));     // eslint-disable-line no-console

    const licenseContent = `${spdxLicenseList[license].licenseText}\n`.replace(/\n/gm, '\n\n');
    mustache.parse(licenseContent, ['<', '>']);

    await fs.writeFile(
      `${projectRoot}/LICENSE`,
      mustache.render(licenseContent, {year: copyright.year, 'copyright holders': copyright.holder})
    );

    const badge = buildLicenseBadge(vcs);
    return {...badge && {badge}};
  }

  return {};
}

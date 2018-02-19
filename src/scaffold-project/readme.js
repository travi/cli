import {readFile, writeFile} from 'mz/fs';
import {resolve} from 'path';
import chalk from 'chalk';
import mustache from 'mustache';

export default async function ({projectName, projectRoot, description, license, vcs}) {
  console.log(chalk.blue('Generating README'));     // eslint-disable-line no-console

  const badgeData = {license: 'LICENSE'};
  const licenseBadge = (vcs && 'GitHub' === vcs.host) && 'https://img.shields.io/github/license/travi/cli.svg';
  const licenseAlt = (license && licenseBadge) && `${license} license`;

  await writeFile(
    `${projectRoot}/README.md`,
    mustache.render(
      await readFile(resolve(__dirname, './templates/README.mustache'), 'utf8'),
      {projectName, description, badgeData, license, licenseBadge, licenseAlt}
    )
  );
}

import {readFile, writeFile} from 'mz/fs';
import {resolve} from 'path';
import chalk from 'chalk';
import mustache from 'mustache';

function buildLicenseBadge(user, repoName) {
  return `https://img.shields.io/github/license/${user}/${repoName}.svg`;
}

export default async function ({projectName, projectRoot, description, license, vcs}) {
  console.log(chalk.blue('Generating README'));     // eslint-disable-line no-console

  const user = 'travi';
  const repoName = 'cli';
  const licenseBadge = (vcs && 'GitHub' === vcs.host) && buildLicenseBadge(user, repoName);
  const licenseAlt = (license && licenseBadge) && `${license} license`;
  const badges = {
    consumer: [(license && licenseBadge) && `[![${license} license][license-badge]][license]`].filter(Boolean)
  };

  const references = [
    !!license && {key: 'license', value: 'LICENSE'},
    !!(license && licenseBadge) && {key: 'license-badge', value: licenseBadge}
  ].filter(Boolean);

  await writeFile(
    `${projectRoot}/README.md`,
    mustache.render(
      await readFile(resolve(__dirname, './templates/README.mustache'), 'utf8'),
      {projectName, description, references, badges, licenseAlt}
    )
  );
}

import {readFile, writeFile} from 'mz/fs';
import {resolve} from 'path';
import chalk from 'chalk';
import mustache from 'mustache';

export default async function ({projectName, projectRoot, description, license, badges}) {
  console.log(chalk.blue('Generating README'));     // eslint-disable-line no-console

  const markdownBadges = {
    consumer: [badges.consumer.license && `[![${license} license][license-badge]][license]`].filter(Boolean)
  };

  const references = [
    license && {key: 'license', value: 'LICENSE'},
    badges.consumer.license && {key: 'license-badge', value: badges.consumer.license}
  ].filter(Boolean);

  await writeFile(
    `${projectRoot}/README.md`,
    mustache.render(
      await readFile(resolve(__dirname, './templates/README.mustache'), 'utf8'),
      {projectName, description, references, badges: markdownBadges}
    )
  );
}

import {readFile, writeFile} from 'mz/fs';
import {resolve} from 'path';
import chalk from 'chalk';
import mustache from 'mustache';

export default async function ({projectName, projectRoot, description, badges}) {
  console.log(chalk.blue('Generating README'));     // eslint-disable-line no-console

  const markdownBadges = {
    consumer: [
      badges.consumer.license && `[![${badges.consumer.license.text}][license-badge]][license-link]`
    ].filter(Boolean),
    status: [badges.status.ci && `[![${badges.status.ci.text}][ci-badge]][ci-link]`].filter(Boolean)
  };

  const references = [
    badges.consumer.license && {key: 'license-link', value: badges.consumer.license.link},
    badges.consumer.license && {key: 'license-badge', value: badges.consumer.license.img},
    badges.status.ci && {key: 'ci-link', value: badges.status.ci.link},
    badges.status.ci && {key: 'ci-badge', value: badges.status.ci.img}
  ].filter(Boolean);

  await writeFile(
    `${projectRoot}/README.md`,
    mustache.render(
      await readFile(resolve(__dirname, './templates/README.mustache'), 'utf8'),
      {projectName, description, references, badges: markdownBadges}
    )
  );
}

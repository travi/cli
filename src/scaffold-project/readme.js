import {readFile, writeFile} from 'mz/fs';
import {resolve} from 'path';
import chalk from 'chalk';
import mustache from 'mustache';

export default async function ({projectName, projectRoot, description}) {
  console.log(chalk.blue('Generating README'));     // eslint-disable-line no-console

  await writeFile(
    `${projectRoot}/README.md`,
    mustache.render(
      await readFile(resolve(__dirname, './templates/README.mustache'), 'utf8'),
      {projectName, description}
    )
  );
}

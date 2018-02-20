import {writeFile} from 'mz/fs';
import chalk from 'chalk';

export default function ({projectRoot, projectName, scope}) {
  console.log(chalk.blue('Initializing JavaScript project'));     // eslint-disable-line no-console

  return writeFile(`${projectRoot}/package.json`, JSON.stringify({
    name: `${scope ? `@${scope}/` : ''}${projectName}`
  }));
}

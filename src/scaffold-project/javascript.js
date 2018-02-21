import {writeFile} from 'mz/fs';
import chalk from 'chalk';
import {prompt} from 'inquirer';
// import {exec} from 'shelljs';

export const questionNames = {
  NODE_VERSION_CATEGORY: 'nodeVersionCategory',
  PACKAGE_TYPE: 'packageType'
};

export default async function ({projectRoot, projectName, scope}) {
  console.log(chalk.blue('Initializing JavaScript project'));     // eslint-disable-line no-console

  await prompt([
    {
      name: questionNames.NODE_VERSION_CATEGORY,
      message: 'What node.js version should be used?',
      type: 'list',
      choices: ['LTS', 'Latest'],
      default: 'Latest'
    },
    {
      name: questionNames.PACKAGE_TYPE,
      message: 'What type of JavaScript project is this?',
      type: 'list',
      choices: ['Application', 'Package'],
      default: 'Package'
    }

  ]);

  // exec('nvm ls-remote');

  await writeFile(`${projectRoot}/package.json`, JSON.stringify({
    name: `${scope ? `@${scope}/` : ''}${projectName}`
  }));
}

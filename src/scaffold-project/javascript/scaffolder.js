import {writeFile} from 'mz/fs';
import chalk from 'chalk';
import {prompt} from 'inquirer';
import {scopePromptShouldBePresented, shouldBeScopedPromptShouldBePresented} from './prompt-condiftionals';
// import {exec} from 'shelljs';

export const questionNames = {
  NODE_VERSION_CATEGORY: 'nodeVersionCategory',
  PACKAGE_TYPE: 'packageType',
  SHOULD_BE_SCOPED: 'shouldBeScoped',
  SCOPE: 'scope'
};

export default async function ({projectRoot, projectName}) {
  console.log(chalk.blue('Initializing JavaScript project'));     // eslint-disable-line no-console

  const answers = await prompt([
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
    },
    {
      name: questionNames.SHOULD_BE_SCOPED,
      message: 'Should this package be scoped?',
      type: 'confirm',
      when: shouldBeScopedPromptShouldBePresented,
      default: true
    },
    {
      name: questionNames.SCOPE,
      message: 'What is the scope?',
      when: scopePromptShouldBePresented,
      default: 'travi'
    }

  ]);

  // exec('nvm ls-remote');

  await writeFile(`${projectRoot}/package.json`, JSON.stringify({
    name: `${answers[questionNames.SCOPE] ? `@${answers[questionNames.SCOPE]}/` : ''}${projectName}`,
    ...('Application' === answers[questionNames.PACKAGE_TYPE]) && {private: true}
  }));
}

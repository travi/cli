import {writeFile} from 'mz/fs';
import chalk from 'chalk';
import {prompt} from 'inquirer';
// import {exec} from 'shelljs';
import buildPackage from './package';
import install from './install';
import {scopePromptShouldBePresented, shouldBeScopedPromptShouldBePresented} from './prompt-condiftionals';

export const questionNames = {
  NODE_VERSION_CATEGORY: 'nodeVersionCategory',
  PACKAGE_TYPE: 'packageType',
  SHOULD_BE_SCOPED: 'shouldBeScoped',
  SCOPE: 'scope',
  UNIT_TESTS: 'unitTests',
  INTEGRATION_TESTS: 'integrationTests'
};

const testingQuestions = [
  {
    name: questionNames.UNIT_TESTS,
    message: 'Will this project be unit tested?',
    type: 'confirm',
    default: true
  },
  {
    name: questionNames.INTEGRATION_TESTS,
    message: 'Will this project be integration tested?',
    type: 'confirm',
    default: true
  }
];

export default async function ({projectRoot, projectName, visibility, license}) {
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
    },
    ...testingQuestions
  ]);

  // exec('. ~/.nvm/nvm.sh && nvm --version && nvm ls-remote');

  const devDependencies = [...answers[questionNames.UNIT_TESTS] ? ['mocha', 'chai'] : []];

  await Promise.all([
    writeFile(
      `${projectRoot}/package.json`,
      JSON.stringify(buildPackage({
        projectName,
        visibility,
        scope: answers[questionNames.SCOPE],
        packageType: answers[questionNames.PACKAGE_TYPE],
        license,
        tests: {
          unit: answers[questionNames.UNIT_TESTS],
          integration: answers[questionNames.INTEGRATION_TESTS]
        }
      }))
    ),
    ('Application' === answers[questionNames.PACKAGE_TYPE]) && writeFile(`${projectRoot}/.npmrc`, 'save-exact=true')
  ]);

  await install(devDependencies);
}

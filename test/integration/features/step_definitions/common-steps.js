import {promises} from 'fs';
import {resolve} from 'path';
import {questionNames as commonQuestionNames} from '@travi/language-scaffolder-prompts';
import {After, Before, setWorldConstructor, When} from 'cucumber';
import any from '@travi/any';

import stubbedFs from 'mock-fs';
import td from 'testdouble';
import {World} from '../support/world';
import {githubToken} from './vcs/github-api-steps';

let action,
  javascriptQuestionNames,
  projectQuestionNames;

const pathToNodeModules = [__dirname, '../../../../', 'node_modules/'];

export const projectNameAnswer = 'project-name';
export const projectDescriptionAnswer = 'some project description';

setWorldConstructor(World);

function loadOctokitFiles(octokitFiles) {
  return octokitFiles
    .map(file => promises.readFile(resolve(...pathToNodeModules, 'octokit-pagination-methods/lib/', file)));
}

function buildOctokitFileMap(octokitFiles) {
  return (acc, fileContents, index) => ({
    ...acc,
    [octokitFiles[index]]: fileContents
  });
}

Before(async function () {
  this.githubUser = any.word();

  // work around for overly aggressive mock-fs, see:
  // https://github.com/tschaub/mock-fs/issues/213#issuecomment-347002795
  require('validate-npm-package-name'); // eslint-disable-line import/no-extraneous-dependencies

  this.shell = td.replace('shelljs');
  td.replace('execa', () => Promise.resolve({stdout: any.word()}));
  projectQuestionNames = require('@travi/project-scaffolder').questionNames;
  javascriptQuestionNames = require('@travi/javascript-scaffolder').questionNames;
  action = require('../../../../src/action').default;

  const octokitFiles = await promises.readdir(resolve(...pathToNodeModules, 'octokit-pagination-methods/lib/'));
  stubbedFs({
    [`${process.env.HOME}/.netrc`]: `machine github.com\n  login ${githubToken}`,
    [`${process.env.HOME}/.gitconfig`]: `[github]\n\tuser = ${this.githubUser}`,
    node_modules: {
      'octokit-pagination-methods': {
        lib: (await Promise.all(loadOctokitFiles(octokitFiles))).reduce(buildOctokitFileMap(octokitFiles), {})
      },
      '@travi': {
        'project-scaffolder': {
          templates: {
            'editorconfig.txt': await promises.readFile(resolve(
              ...pathToNodeModules,
              '@travi/project-scaffolder/templates/editorconfig.txt'
            )),
            'README.mustache': await promises.readFile(resolve(
              ...pathToNodeModules,
              '@travi/project-scaffolder/templates/README.mustache'
            ))
          }
        },
        'javascript-scaffolder': {
          templates: {
            'rollup.config.js': await promises.readFile(resolve(
              ...pathToNodeModules,
              '@travi/javascript-scaffolder/templates/rollup.config.js'
            )),
            'canary-test.txt': await promises.readFile(resolve(
              ...pathToNodeModules,
              '@travi/javascript-scaffolder/templates/canary-test.txt'
            )),
            'mocha-setup.txt': await promises.readFile(resolve(
              ...pathToNodeModules,
              '@travi/javascript-scaffolder/templates/mocha-setup.txt'
            ))
          }
        }
      }
    }
  });
});

After(function () {
  stubbedFs.restore();
  td.reset();
});

When(/^the project is scaffolded$/, async function () {
  const visibility = any.fromList(['Public', 'Private']);
  const repoShouldBeCreated = this.getAnswerFor(projectQuestionNames.GIT_REPO);
  const projectType = this.getAnswerFor(projectQuestionNames.PROJECT_TYPE);

  await action({
    [projectQuestionNames.PROJECT_NAME]: projectNameAnswer,
    [projectQuestionNames.DESCRIPTION]: projectDescriptionAnswer,
    [projectQuestionNames.VISIBILITY]: visibility,
    ...'Public' === visibility && {
      [projectQuestionNames.LICENSE]: 'MIT',
      [projectQuestionNames.COPYRIGHT_HOLDER]: any.word(),
      [projectQuestionNames.COPYRIGHT_YEAR]: 2000
    },
    ...'Private' === visibility && {[projectQuestionNames.UNLICENSED]: true},
    [projectQuestionNames.GIT_REPO]: repoShouldBeCreated,
    ...repoShouldBeCreated && {
      [projectQuestionNames.REPO_HOST]: 'GitHub',
      [projectQuestionNames.REPO_OWNER]: this.githubUser
    },
    [projectQuestionNames.PROJECT_TYPE]: projectType,
    ...'JavaScript' === projectType && {
      [javascriptQuestionNames.NODE_VERSION_CATEGORY]: 'LTS',
      [javascriptQuestionNames.AUTHOR_NAME]: any.word(),
      [javascriptQuestionNames.AUTHOR_EMAIL]: any.email(),
      [javascriptQuestionNames.AUTHOR_URL]: any.url(),
      [javascriptQuestionNames.PROJECT_TYPE]: 'Package',
      [commonQuestionNames.UNIT_TESTS]: true,
      [commonQuestionNames.INTEGRATION_TESTS]: true,
      [commonQuestionNames.CI_SERVICE]: 'Travis',
      [javascriptQuestionNames.TRANSPILE_LINT]: true,
      [javascriptQuestionNames.PROJECT_TYPE_CHOICE]: 'Other',
      [javascriptQuestionNames.SCOPE]: any.word()
    }
  })();
});

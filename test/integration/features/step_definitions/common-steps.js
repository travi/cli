import {resolve} from 'path';
import {After, Before, setWorldConstructor, When} from 'cucumber';
import any from '@travi/any';

import stubbedFs from 'mock-fs';
import td from 'testdouble';
import {World} from '../support/world';
import {githubToken} from './vcs/github-api-steps';

let scaffoldProject, addPackageToMonorepo;

const projectDescription = any.sentence();
const visibility = any.fromList(['Public', 'Private']);
const shouldBeScoped = any.boolean();
const scope = shouldBeScoped || 'Private' === visibility ? any.word() : undefined;

const pathToNodeModules = [__dirname, '..', '..', '..', '..', 'node_modules'];
const stubbedNodeModules = stubbedFs.load(resolve(...pathToNodeModules));

setWorldConstructor(World);

Before(async function () {
  this.githubUser = any.word();
  this.projectName = any.word();

  // work around for overly aggressive mock-fs, see:
  // https://github.com/tschaub/mock-fs/issues/213#issuecomment-347002795
  require('validate-npm-package-name'); // eslint-disable-line import/no-extraneous-dependencies
  require('color-convert'); // eslint-disable-line import/no-extraneous-dependencies

  this.shell = td.replace('shelljs');
  this.execa = td.replace('execa');

  scaffoldProject = require('../../../../src/scaffolder/action').default;
  addPackageToMonorepo = require('../../../../src/add-package/action').default;

  stubbedFs({
    [`${process.env.HOME}/.netrc`]: `machine github.com\n  login ${githubToken}`,
    [`${process.env.HOME}/.gitconfig`]: `[github]\n\tuser = ${this.githubUser}`,
    node_modules: stubbedNodeModules
  });
});

After(function () {
  stubbedFs.restore();
  td.reset();
});

When(/^the project is scaffolded$/, async function () {
  const projectQuestionNames = require('@travi/project-scaffolder').questionNames;
  const javascriptQuestionNames = require('@travi/javascript-scaffolder').questionNames;
  const repoShouldBeCreated = this.getAnswerFor(projectQuestionNames.GIT_REPO);
  const projectLanguage = this.getAnswerFor(projectQuestionNames.PROJECT_LANGUAGE);

  await scaffoldProject({
    [projectQuestionNames.PROJECT_NAME]: this.projectName,
    [projectQuestionNames.DESCRIPTION]: projectDescription,
    [projectQuestionNames.VISIBILITY]: visibility,
    [projectQuestionNames.DEPENDENCY_UPDATER]: any.word(),
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
    [projectQuestionNames.PROJECT_LANGUAGE]: projectLanguage,
    ...'JavaScript' === projectLanguage && {
      [javascriptQuestionNames.NODE_VERSION_CATEGORY]: 'LTS',
      [javascriptQuestionNames.AUTHOR_NAME]: any.word(),
      [javascriptQuestionNames.AUTHOR_EMAIL]: any.email(),
      [javascriptQuestionNames.AUTHOR_URL]: any.url(),
      [javascriptQuestionNames.PROJECT_TYPE]: 'Package',
      [javascriptQuestionNames.UNIT_TESTS]: true,
      [javascriptQuestionNames.INTEGRATION_TESTS]: true,
      [javascriptQuestionNames.CI_SERVICE]: 'Travis',
      [javascriptQuestionNames.TRANSPILE_LINT]: true,
      [javascriptQuestionNames.PROJECT_TYPE_CHOICE]: 'Other',
      [javascriptQuestionNames.SHOULD_BE_SCOPED]: shouldBeScoped,
      [javascriptQuestionNames.SCOPE]: scope,
      [javascriptQuestionNames.UNIT_TEST_FRAMEWORK]: 'mocha'
    }
  })();
});

When('a package is added to the monorepo', async function () {
  const addPackageQuestionNames = require('@form8ion/add-package-to-monorepo').questionNames;

  await addPackageToMonorepo({
    [addPackageQuestionNames.PROJECT_NAME]: this.projectName,
    [addPackageQuestionNames.DESCRIPTION]: projectDescription,
    [addPackageQuestionNames.VISIBILITY]: visibility,
    ...'Public' === visibility && {
      [addPackageQuestionNames.LICENSE]: 'MIT',
      [addPackageQuestionNames.COPYRIGHT_HOLDER]: any.word(),
      [addPackageQuestionNames.COPYRIGHT_YEAR]: 2000
    },
    ...'Private' === visibility && {[addPackageQuestionNames.UNLICENSED]: true},
    [addPackageQuestionNames.UNIT_TESTS]: true,
    [addPackageQuestionNames.INTEGRATION_TESTS]: true,
    [addPackageQuestionNames.TRANSPILE_LINT]: true,
    [addPackageQuestionNames.SHOULD_BE_SCOPED]: shouldBeScoped,
    [addPackageQuestionNames.SCOPE]: scope,
    [addPackageQuestionNames.AUTHOR_NAME]: any.word(),
    [addPackageQuestionNames.AUTHOR_EMAIL]: any.email(),
    [addPackageQuestionNames.AUTHOR_URL]: any.url(),
    [addPackageQuestionNames.PROJECT_TYPE_CHOICE]: 'Other',
    [addPackageQuestionNames.UNIT_TEST_FRAMEWORK]: 'mocha'
  });
});

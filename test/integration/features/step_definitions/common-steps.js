import {resolve} from 'path';
import {After, Before, setWorldConstructor, When} from '@cucumber/cucumber';
import any from '@travi/any';
import importFresh from 'import-fresh';
import clearModule from 'clear-module';
import stubbedFs from 'mock-fs';
import td from 'testdouble';
import {World} from '../support/world';
import {githubToken} from './vcs/github-api-steps';

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
  this.projectVisibility = visibility;

  // work around for overly aggressive mock-fs, see:
  // https://github.com/tschaub/mock-fs/issues/213#issuecomment-347002795
  require('validate-npm-package-name'); // eslint-disable-line import/no-extraneous-dependencies
  require('color-convert'); // eslint-disable-line import/no-extraneous-dependencies

  this.execa = td.replace('execa');
  this.nodegit = td.replace('@form8ion/nodegit-wrapper');
});

After(function () {
  stubbedFs.restore();
  td.reset();
  clearModule('@form8ion/add-package-to-monorepo');
  clearModule('@form8ion/eslint-config-extender');
  clearModule('@form8ion/replace-travis-ci-with-github-action');
  clearModule('@form8ion/ruby-scaffolder');
  clearModule('@form8ion/project');
  clearModule('@form8ion/lift-javascript');
  clearModule('@form8ion/javascript-core');
  clearModule('@form8ion/husky');
  clearModule('travis-token-updater');
  clearModule('execa');
  clearModule('../../../../src/scaffolder/action');
});

When(/^the project is scaffolded$/, async function () {
  const {questionNames: projectQuestionNames} = importFresh('@form8ion/project');
  const {questionNames: javascriptQuestionNames} = importFresh('@form8ion/javascript');
  const {projectTypes} = require('@form8ion/javascript-core');
  const repoShouldBeCreated = this.getAnswerFor(projectQuestionNames.GIT_REPO);
  const projectLanguage = this.getAnswerFor(projectQuestionNames.PROJECT_LANGUAGE);
  const jsProjectType = this.getAnswerFor(javascriptQuestionNames.PROJECT_TYPE);

  const scaffoldProject = importFresh('../../../../src/scaffolder/action').default;

  stubbedFs({
    [`${process.env.HOME}/.netrc`]: `machine api.github.com\n  login ${githubToken}`,
    [`${process.env.HOME}/.gitconfig`]: `[github]\n\tuser = ${this.githubUser}`,
    node_modules: stubbedNodeModules
  });

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
      [javascriptQuestionNames.PROJECT_TYPE]: jsProjectType || 'Package',
      ...projectTypes.APPLICATION === jsProjectType && {
        [javascriptQuestionNames.HOST]: 'Other'
      },
      [javascriptQuestionNames.UNIT_TESTS]: true,
      [javascriptQuestionNames.INTEGRATION_TESTS]: true,
      [javascriptQuestionNames.CI_SERVICE]: 'Travis',
      [javascriptQuestionNames.CONFIGURE_LINTING]: true,
      [javascriptQuestionNames.PROJECT_TYPE_CHOICE]: this.getAnswerFor(javascriptQuestionNames.PROJECT_TYPE_CHOICE)
        || 'Other',
      [javascriptQuestionNames.SHOULD_BE_SCOPED]: shouldBeScoped,
      [javascriptQuestionNames.SCOPE]: scope,
      [javascriptQuestionNames.UNIT_TEST_FRAMEWORK]: 'mocha',
      [javascriptQuestionNames.DIALECT]: this.dialect
    }
  })();
});

When('a package is added to the monorepo', async function () {
  const addPackageQuestionNames = importFresh('@form8ion/add-package-to-monorepo').questionNames;
  const {dialects} = require('@form8ion/javascript-core');

  const addPackageToMonorepo = importFresh('../../../../src/add-package/action').default;

  stubbedFs({
    ...'lerna' === this.monorepoType && {
      'lerna.json': JSON.stringify({}),
      'package.json': JSON.stringify({repository: `${this.githubUser}/${this.projectName}`}),
      'package-lock.json': JSON.stringify(any.simpleObject())
    },
    [`${process.env.HOME}/.netrc`]: `machine github.com\n  login ${githubToken}`,
    [`${process.env.HOME}/.gitconfig`]: `[github]\n\tuser = ${this.githubUser}`,
    node_modules: stubbedNodeModules
  });

  await addPackageToMonorepo({
    [addPackageQuestionNames.PROJECT_NAME]: this.projectName,
    [addPackageQuestionNames.DESCRIPTION]: projectDescription,
    [addPackageQuestionNames.VISIBILITY]: visibility,
    [addPackageQuestionNames.NODE_VERSION_CATEGORY]: 'LTS',
    ...'Public' === visibility && {
      [addPackageQuestionNames.LICENSE]: 'MIT',
      [addPackageQuestionNames.COPYRIGHT_HOLDER]: any.word(),
      [addPackageQuestionNames.COPYRIGHT_YEAR]: 2000
    },
    ...'Private' === visibility && {[addPackageQuestionNames.UNLICENSED]: true},
    [addPackageQuestionNames.UNIT_TESTS]: true,
    [addPackageQuestionNames.INTEGRATION_TESTS]: true,
    [addPackageQuestionNames.CONFIGURE_LINTING]: true,
    [addPackageQuestionNames.SHOULD_BE_SCOPED]: shouldBeScoped,
    [addPackageQuestionNames.SCOPE]: scope,
    [addPackageQuestionNames.AUTHOR_NAME]: any.word(),
    [addPackageQuestionNames.AUTHOR_EMAIL]: any.email(),
    [addPackageQuestionNames.AUTHOR_URL]: any.url(),
    [addPackageQuestionNames.PROJECT_TYPE_CHOICE]: 'Other',
    [addPackageQuestionNames.UNIT_TEST_FRAMEWORK]: 'mocha',
    [addPackageQuestionNames.DIALECT]: dialects.BABEL
  });
});

import {resolve} from 'path';
import {After, Before, setWorldConstructor, When} from 'cucumber';
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

  // work around for overly aggressive mock-fs, see:
  // https://github.com/tschaub/mock-fs/issues/213#issuecomment-347002795
  require('validate-npm-package-name'); // eslint-disable-line import/no-extraneous-dependencies
  require('color-convert'); // eslint-disable-line import/no-extraneous-dependencies

  this.execa = td.replace('execa');
});

After(function () {
  stubbedFs.restore();
  td.reset();
  clearModule('@travi/javascript-scaffolder');
  clearModule('@form8ion/javascript-core');
  clearModule('@form8ion/lift-javascript');
  clearModule('@form8ion/add-package-to-monorepo');
  clearModule('execa');
});

When(/^the project is scaffolded$/, async function () {
  const projectQuestionNames = importFresh('@travi/project-scaffolder').questionNames;
  const javascriptQuestionNames = importFresh('@travi/javascript-scaffolder').questionNames;
  const repoShouldBeCreated = this.getAnswerFor(projectQuestionNames.GIT_REPO);
  const projectLanguage = this.getAnswerFor(projectQuestionNames.PROJECT_LANGUAGE);

  const scaffoldProject = importFresh('../../../../src/scaffolder/action').default;

  stubbedFs({
    [`${process.env.HOME}/.netrc`]: `machine github.com\n  login ${githubToken}`,
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
  const addPackageQuestionNames = importFresh('@form8ion/add-package-to-monorepo').questionNames;

  const addPackageToMonorepo = importFresh('../../../../src/add-package/action').default;

  stubbedFs({
    ...'lerna' === this.monorepoType && {
      'lerna.json': JSON.stringify({}),
      'package.json': JSON.stringify({repository: `${this.githubUser}/${this.projectName}`})
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

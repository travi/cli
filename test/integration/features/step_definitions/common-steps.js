import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {promptConstants as githubPromptConstants} from '@form8ion/github';

import {After, Before, setWorldConstructor, When} from '@cucumber/cucumber';
import any from '@travi/any';
import stubbedFs from 'mock-fs';
import * as td from 'testdouble';

import {World} from '../support/world.js';
import {githubToken} from './vcs/github-api-steps.js';

const __dirname = dirname(fileURLToPath(import.meta.url));        // eslint-disable-line no-underscore-dangle

const pathToNodeModules = [__dirname, '..', '..', '..', '..', 'node_modules'];
export const stubbedNodeModules = stubbedFs.load(resolve(...pathToNodeModules));

setWorldConstructor(World);

Before(async function () {
  this.projectRoot = process.cwd();
  this.githubUser = any.word();
  this.projectName = any.word();
  this.visibility = any.fromList(['Public', 'Private']);
  this.shouldBeScoped = any.boolean();
  this.scope = this.shouldBeScoped || 'Private' === this.visibility ? any.word() : undefined;
  this.projectDescription = any.sentence();

  ({execa: this.execa} = (await td.replaceEsm('execa')));
  this.git = await td.replaceEsm('simple-git');
});

After(function () {
  stubbedFs.restore();
  td.reset();
});

When(/^the project is scaffolded$/, async function () {
  const {questionNames: projectQuestionNames} = await import('@form8ion/project');
  const {questionNames: javascriptQuestionNames} = await import('@form8ion/javascript');
  const {projectTypes} = await import('@form8ion/javascript-core');
  const repoShouldBeCreated = this.getAnswerFor(projectQuestionNames.GIT_REPO);
  const projectLanguage = this.getAnswerFor(projectQuestionNames.PROJECT_LANGUAGE);
  const jsProjectType = this.getAnswerFor(javascriptQuestionNames.PROJECT_TYPE) || projectTypes.PACKAGE;

  const {default: scaffoldProject} = (await import('../../../../src/scaffolder/action.js'));

  stubbedFs({
    [`${process.env.HOME}/.netrc`]: `machine api.github.com\n  login ${githubToken}`,
    [`${process.env.HOME}/.gitconfig`]: `[github]\n\tuser = ${this.githubUser}`,
    node_modules: stubbedNodeModules
  });

  await scaffoldProject({
    [projectQuestionNames.PROJECT_NAME]: this.projectName,
    [projectQuestionNames.DESCRIPTION]: this.projectDescription,
    [projectQuestionNames.VISIBILITY]: this.visibility,
    [projectQuestionNames.DEPENDENCY_UPDATER]: any.word(),
    ...'Public' === this.visibility && {
      [projectQuestionNames.LICENSE]: 'MIT',
      [projectQuestionNames.COPYRIGHT_HOLDER]: 'Matt Travi',
      [projectQuestionNames.COPYRIGHT_YEAR]: 2000
    },
    ...'Private' === this.visibility && {[projectQuestionNames.UNLICENSED]: true},
    [projectQuestionNames.GIT_REPO]: repoShouldBeCreated,
    ...repoShouldBeCreated && {
      [projectQuestionNames.REPO_HOST]: 'GitHub',
      [githubPromptConstants.questionNames[githubPromptConstants.ids.GITHUB_DETAILS].GITHUB_ACCOUNT]: this.githubUser
    },
    [projectQuestionNames.PROJECT_LANGUAGE]: projectLanguage,
    ...'JavaScript' === projectLanguage && {
      [javascriptQuestionNames.NODE_VERSION_CATEGORY]: 'LTS',
      [javascriptQuestionNames.AUTHOR_NAME]: any.word(),
      [javascriptQuestionNames.AUTHOR_EMAIL]: any.email(),
      [javascriptQuestionNames.AUTHOR_URL]: any.url(),
      [javascriptQuestionNames.PROJECT_TYPE]: jsProjectType,
      ...projectTypes.APPLICATION === jsProjectType && {
        [javascriptQuestionNames.HOST]: 'Other'
      },
      ...projectTypes.PACKAGE === jsProjectType && {
        [javascriptQuestionNames.PACKAGE_BUNDLER]: this.getAnswerFor(javascriptQuestionNames.PACKAGE_BUNDLER),
        [javascriptQuestionNames.PROVIDE_EXAMPLE]: true
      },
      [javascriptQuestionNames.UNIT_TESTS]: true,
      [javascriptQuestionNames.INTEGRATION_TESTS]: true,
      [javascriptQuestionNames.CI_SERVICE]: 'Travis',
      [javascriptQuestionNames.CONFIGURE_LINTING]: true,
      [javascriptQuestionNames.PROJECT_TYPE_CHOICE]: this.getAnswerFor(javascriptQuestionNames.PROJECT_TYPE_CHOICE)
        || 'Other',
      [javascriptQuestionNames.SHOULD_BE_SCOPED]: this.shouldBeScoped,
      [javascriptQuestionNames.SCOPE]: this.scope,
      [javascriptQuestionNames.UNIT_TEST_FRAMEWORK]: 'mocha',
      [javascriptQuestionNames.DIALECT]: this.dialect
    }
  })();
});

When('a package is added to the monorepo', async function () {
  const {questionNames: addPackageQuestionNames} = await import('@form8ion/add-package-to-monorepo');

  const {default: addPackageToMonorepo} = await import('../../../../src/add-package/action.js');

  stubbedFs({
    ...'lerna' === this.monorepoType && {
      'lerna.json': JSON.stringify({packages: ['packages/*']}),
      'package.json': JSON.stringify({repository: `${this.githubUser}/${this.projectName}`}),
      'package-lock.json': JSON.stringify(any.simpleObject())
    },
    [`${process.env.HOME}/.netrc`]: `machine github.com\n  login ${githubToken}`,
    [`${process.env.HOME}/.gitconfig`]: `[github]\n\tuser = ${this.githubUser}`,
    node_modules: stubbedNodeModules
  });

  await addPackageToMonorepo({
    [addPackageQuestionNames.PROJECT_NAME]: this.projectName,
    [addPackageQuestionNames.DESCRIPTION]: this.projectDescription,
    [addPackageQuestionNames.VISIBILITY]: this.visibility,
    [addPackageQuestionNames.NODE_VERSION_CATEGORY]: 'LTS',
    [addPackageQuestionNames.PROVIDE_EXAMPLE]: true,
    ...'Public' === this.visibility && {
      [addPackageQuestionNames.LICENSE]: 'MIT',
      [addPackageQuestionNames.COPYRIGHT_HOLDER]: any.word(),
      [addPackageQuestionNames.COPYRIGHT_YEAR]: 2000
    },
    ...'Private' === this.visibility && {[addPackageQuestionNames.UNLICENSED]: true},
    [addPackageQuestionNames.UNIT_TESTS]: true,
    [addPackageQuestionNames.INTEGRATION_TESTS]: true,
    [addPackageQuestionNames.CONFIGURE_LINTING]: true,
    [addPackageQuestionNames.SHOULD_BE_SCOPED]: this.shouldBeScoped,
    [addPackageQuestionNames.SCOPE]: this.scope,
    [addPackageQuestionNames.AUTHOR_NAME]: any.word(),
    [addPackageQuestionNames.AUTHOR_EMAIL]: any.email(),
    [addPackageQuestionNames.AUTHOR_URL]: any.url(),
    [addPackageQuestionNames.PROJECT_TYPE_CHOICE]: 'Other',
    [addPackageQuestionNames.UNIT_TEST_FRAMEWORK]: 'mocha',
    [addPackageQuestionNames.PACKAGE_BUNDLER]: 'Rollup',
    [addPackageQuestionNames.DIALECT]: this.dialect
  });
});

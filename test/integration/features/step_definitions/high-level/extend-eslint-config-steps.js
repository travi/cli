import {promises as fs} from 'node:fs';
import {promptConstants as githubPromptConstants} from '@form8ion/github';
import {load as loadConfig} from '@form8ion/config-file';

import {Given, Then, When} from '@cucumber/cucumber';
import any from '@travi/any';
import {assert} from 'chai';
import stubbedFs from 'mock-fs';

import {githubToken} from '../vcs/github-api-steps.js';
import {stubbedNodeModules} from '../common-steps.js';

Given('the eslint config to be extended exists from the form8ion scope', async function () {
  this.scope = any.word();
  this.eslintConfigShortName = any.word();
  this.projectName = `eslint-config-${this.eslintConfigShortName}`;
});

When('the high-level eslint-config scaffolder is executed', async function () {
  const {questionNames: projectQuestionNames} = await import('@form8ion/project');
  const {questionNames: javascriptQuestionNames} = await import('@form8ion/javascript');
  const repoShouldBeCreated = this.getAnswerFor(projectQuestionNames.GIT_REPO);

  const {default: extendEslintConfig} = (await import('../../../../../src/extend-eslint-config/action.js'));

  stubbedFs({
    [`${process.env.HOME}/.netrc`]: `machine api.github.com\n  login ${githubToken}`,
    [`${process.env.HOME}/.gitconfig`]: `[github]\n\tuser = ${this.githubUser}`,
    node_modules: stubbedNodeModules
  });

  await extendEslintConfig({
    [projectQuestionNames.PROJECT_NAME]: this.projectName,
    [projectQuestionNames.DESCRIPTION]: this.projectDescription,
    [projectQuestionNames.VISIBILITY]: this.visibility,
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
    [projectQuestionNames.DEPENDENCY_UPDATER]: any.word(),
    [javascriptQuestionNames.NODE_VERSION_CATEGORY]: 'LTS',
    [javascriptQuestionNames.AUTHOR_NAME]: any.word(),
    [javascriptQuestionNames.AUTHOR_EMAIL]: any.email(),
    [javascriptQuestionNames.AUTHOR_URL]: any.url(),
    [javascriptQuestionNames.PROVIDE_EXAMPLE]: true,
    [javascriptQuestionNames.CI_SERVICE]: 'Travis',
    [javascriptQuestionNames.SCOPE]: this.scope
  });
});

Then('the proper form8ion eslint config is extended', async function () {
  const eslintConfig = await loadConfig({name: 'eslint'});
  const exportedConfig = await fs.readFile(`${this.projectRoot}/index.js`, 'utf-8');

  assert.equal(
    exportedConfig,
    `module.exports = {extends: '@form8ion/${this.eslintConfigShortName}'};
`
  );
  assert.deepEqual(eslintConfig.extends, [`@${this.scope}`, '.']);
});

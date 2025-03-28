import {promises as fs, writeFileSync} from 'node:fs';
import {fileExists} from '@form8ion/core';
import {load as loadConfig} from '@form8ion/config-file';

import {Before, Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import any from '@travi/any';
import * as td from 'testdouble';

function versionSegment() {
  return any.integer({max: 20});
}

const majorVersion = versionSegment();

function semverStringFactory() {
  return `v${majorVersion}.${versionSegment()}.${versionSegment()}`;
}

let questionNames, jsQuestionNames, projectTypes;

Before(async function () {
  ({questionNames} = await import('@form8ion/project'));
  ({questionNames: jsQuestionNames} = await import('@form8ion/javascript'));
  ({projectTypes} = await import('@form8ion/javascript-core'));
});

Given(/^the project language should be JavaScript$/, async function () {
  this.setAnswerFor(questionNames.PROJECT_LANGUAGE, 'JavaScript');
  this.setAnswerFor(jsQuestionNames.PACKAGE_BUNDLER, 'Rollup');
  const huskyVersionError = new Error();
  huskyVersionError.stdout = JSON.stringify({});
  huskyVersionError.command = 'npm ls husky --json';
  huskyVersionError.exitCode = 1;

  td.when(this.execa('npm run generate:md && npm test', {shell: true}))
    .thenReturn({stdout: {pipe: () => undefined}});
  td.when(this.execa('npm', ['whoami'])).thenResolve(any.word());
  td.when(this.execa('npm', ['ls', 'husky', '--json'])).thenReject(huskyVersionError);
  td.when(this.execa(
    td.matchers.contains('. ~/.nvm/nvm.sh && nvm use && npm install'),
    {shell: true, cwd: this.projectRoot}
  )).thenDo(() => writeFileSync(`${this.projectRoot}/package-lock.json`, JSON.stringify(any.simpleObject())));
  td.when(this.execa('npm', ['--version'])).thenResolve({stdout: any.word()});
});

Given('the project will use the {string} dialect', async function (dialect) {
  this.dialect = dialect;
});

Given('the project is a presentation', async function () {
  this.setAnswerFor(jsQuestionNames.PROJECT_TYPE, projectTypes.APPLICATION);
  this.setAnswerFor(jsQuestionNames.PROJECT_TYPE_CHOICE, 'Slidev');
});

Given(/^nvm is properly configured$/, function () {
  const latestLtsVersion = semverStringFactory();

  td.when(this.execa('. ~/.nvm/nvm.sh && nvm ls-remote --lts', {shell: true}))
    .thenResolve({stdout: [...any.listOf(semverStringFactory), latestLtsVersion, ''].join('\n')});
  td.when(this.execa('. ~/.nvm/nvm.sh && nvm install', {shell: true}))
    .thenReturn({stdout: {pipe: () => undefined}});
});

Then(/^JavaScript ignores are defined$/, async function () {
  const gitIgnore = await fs.readFile(`${this.projectRoot}/.gitignore`);

  assert.equal(gitIgnore.toString(), `/node_modules/
/lib/
/coverage/
/.nyc_output/

.eslintcache`);
});

Then(/^the core JavaScript files are present$/, async function () {
  const eslintConfig = await loadConfig({name: 'eslint'});

  assert.isTrue(await fileExists(`${this.projectRoot}/package.json`));
  assert.deepEqual(eslintConfig.extends, ['@travi', '@travi/mocha']);
  if ('Slidev' === this.getAnswerFor(jsQuestionNames.PROJECT_TYPE_CHOICE)) {
    assert.deepEqual(eslintConfig.overrides, [{files: 'test/smoke/**/*-spec.js', extends: '@travi/cypress'}]);
  } else {
    assert.isUndefined(eslintConfig.overrides);
  }
  assert.isTrue(await fileExists(`${this.projectRoot}/package-lock.json`));
});

Then('the project will have repository details defined', async function () {
  assert.deepEqual(
    JSON.parse(await fs.readFile(`${this.projectRoot}/package.json`)).repository,
    `${this.githubUser}/${this.projectName}`
  );
});

Then('the JavaScript project is verified after scaffolding', async function () {
  td.verify(this.execa('npm run generate:md && npm test', {shell: true}));
});

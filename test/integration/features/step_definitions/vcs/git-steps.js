import {promises} from 'fs';
import * as td from 'testdouble';
import {fileExists} from '@form8ion/core';
import {Before, Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import any from '@travi/any';

let questionNames;
const simpleGitInstance = td.object(['checkIsRepo', 'listRemote', 'remote', 'addRemote', 'init']);

Before(async () => {
  ({questionNames} = (await import('@form8ion/project')));
});

Given(/^the project should be versioned in git$/, async function () {
  this.setAnswerFor(questionNames.GIT_REPO, true);

  td.when(this.git.simpleGit({baseDir: process.cwd()})).thenReturn(simpleGitInstance);
  td.when(simpleGitInstance.checkIsRepo('root')).thenResolve(false, true);
  td.when(simpleGitInstance.listRemote()).thenResolve([]);
});

Given(/^the project should not be versioned in git$/, async function () {
  this.setAnswerFor(questionNames.GIT_REPO, false);
});

Then(/^the base git files should be present$/, async function () {
  const gitAttributes = await promises.readFile(`${process.cwd()}/.gitattributes`);

  assert.equal(gitAttributes, '* text=auto');

  td.verify(simpleGitInstance.init());
  td.verify(simpleGitInstance.addRemote('origin', this.repoSshUrl));
});

Then('the base git files should not be present', async function () {
  assert.isFalse(await fileExists(`${process.cwd()}/.git`));
  assert.isFalse(await fileExists(`${process.cwd()}/.gitattributes`));
  assert.isFalse(await fileExists(`${process.cwd()}/.gitignore`));
});

Given('the repository is already initialized', async function () {
  this.repoName = any.word();
  this.repoOwner = any.word();

  td.when(this.git.simpleGit(process.cwd())).thenReturn(simpleGitInstance);
  td.when(simpleGitInstance.checkIsRepo('root')).thenResolve(true);
  td.when(simpleGitInstance.listRemote()).thenResolve(['origin']);
  td.when(simpleGitInstance.remote(['get-url', 'origin']))
    .thenResolve(`git@github.com:${any.word()}/${this.projectName}.git`);
});

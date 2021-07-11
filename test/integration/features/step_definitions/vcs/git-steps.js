import {promises} from 'fs';
import td from 'testdouble';
import {fileExists} from '@form8ion/core';
import {Before, Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import any from '@travi/any';

let questionNames;
const nodegitRepository = any.simpleObject();

Before(() => {
  questionNames = require('@form8ion/project').questionNames;
});

Given(/^the project should be versioned in git$/, async function () {
  this.setAnswerFor(questionNames.GIT_REPO, true);

  td.when(this.nodegit.Repository.open(process.cwd())).thenResolve(nodegitRepository);
  td.when(this.nodegit.Remote.list(nodegitRepository)).thenResolve([]);
});

Given(/^the project should not be versioned in git$/, async function () {
  this.setAnswerFor(questionNames.GIT_REPO, false);
});

Then(/^the base git files should be present$/, async function () {
  const gitAttributes = await promises.readFile(`${process.cwd()}/.gitattributes`);

  assert.equal(gitAttributes, '* text=auto');

  td.verify(this.nodegit.Remote.create(nodegitRepository, 'origin', this.repoSshUrl));
});

Then('the base git files should not be present', async function () {
  assert.isFalse(await fileExists(`${process.cwd()}/.git`));
  assert.isFalse(await fileExists(`${process.cwd()}/.gitattributes`));
  assert.isFalse(await fileExists(`${process.cwd()}/.gitignore`));
});

Given('the repository is already initialized', async function () {
  this.repoName = any.word();
  this.repoOwner = any.word();
  this.repoExists = true;
  const nodegitRemote = {
    ...any.simpleObject(),
    url: () => `git@github.com:${this.repoOwner}/${this.repoName}.git`
  };

  td.when(this.nodegit.Repository.open(process.cwd())).thenResolve(nodegitRepository);
  td.when(this.nodegit.Remote.list(nodegitRepository)).thenResolve(['origin']);
  td.when(this.nodegit.Remote.lookup(nodegitRepository, 'origin')).thenResolve(nodegitRemote);
});

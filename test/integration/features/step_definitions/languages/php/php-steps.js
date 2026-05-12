import {fileExists} from '@form8ion/core';

import {Before, Given, Then} from '@cucumber/cucumber';
import assert from 'node:assert';
import * as td from 'testdouble';

let projectQuestionNames;

Before(async function () {
  const {promptConstants} = await import('@form8ion/project');
  projectQuestionNames = promptConstants.questionNames[promptConstants.ids.PROJECT_LANGUAGE];
});

Given('the project language should be PHP', async function () {
  this.setAnswerFor(projectQuestionNames.PROJECT_LANGUAGE, 'PHP');

  td.when(this.execa('./vendor/bin/phing', {shell: true}))
    .thenReturn({stdout: {pipe: () => undefined}});
});

Then('the core PHP files are present', async function () {
  assert(await fileExists(`${this.projectRoot}/composer.json`));
  assert(await fileExists(`${this.projectRoot}/build.xml`));
  assert(await fileExists(`${this.projectRoot}/phpunit.xml`));
});

Then('the php project is verified after scaffolding', async function () {
  td.verify(this.execa('./vendor/bin/phing', {shell: true}));
});

Then('php dependencies are installed', async function () {
  td.verify(this.execa('composer', ['require', 'phing/phing', 'phpunit/phpunit', '--dev'], {cwd: this.projectRoot}));
});

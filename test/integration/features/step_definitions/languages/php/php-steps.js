import {fileExists} from '@form8ion/core';

import {Before, Given, Then} from '@cucumber/cucumber';
import assert from 'node:assert';
import * as td from 'testdouble';

let questionNames;

Before(async function () {
  ({questionNames} = await import('@form8ion/project'));
});

Given('the project language should be PHP', async function () {
  this.setAnswerFor(questionNames.PROJECT_LANGUAGE, 'PHP');

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

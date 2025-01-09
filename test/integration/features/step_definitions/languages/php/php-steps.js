import {fileExists} from '@form8ion/core';

import {Before, Given, Then} from '@cucumber/cucumber';
import assert from 'node:assert';

let questionNames;

Before(async function () {
  ({questionNames} = await import('@form8ion/project'));
});

Given('the project language should be PHP', async function () {
  this.setAnswerFor(questionNames.PROJECT_LANGUAGE, 'PHP');
});

Then('the core PHP files are present', async function () {
  assert(await fileExists(`${this.projectRoot}/composer.json`));
});

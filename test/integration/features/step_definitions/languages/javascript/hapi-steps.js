import {fileExists} from '@form8ion/core';

import {Before, Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';

let jsQuestionNames, projectTypes;

Before(async function () {
  ({questionNames: jsQuestionNames} = await import('@form8ion/javascript'));
  ({projectTypes} = await import('@form8ion/javascript-core'));
});

Given('the project is a Hapi application', async function () {
  this.setAnswerFor(jsQuestionNames.PROJECT_TYPE, projectTypes.APPLICATION);
  this.setAnswerFor(jsQuestionNames.PROJECT_TYPE_CHOICE, 'Hapi');
});

Then('the Hapi server is configured', async function () {
  assert.isTrue(await fileExists(`${this.projectRoot}/src/server/index.js`));
  assert.isTrue(await fileExists(`${this.projectRoot}/src/server/server.js`));
  assert.isTrue(await fileExists(`${this.projectRoot}/src/server/manifest.js`));
});

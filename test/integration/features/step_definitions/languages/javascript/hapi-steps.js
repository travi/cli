import {fileExists} from '@form8ion/core';

import {Before, Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';

let jsBaseDetailsQuestionNames, jsProjectTypePluginQuestionNames, projectTypes;

Before(async function () {
  const {promptConstants: jsPromptConstants} = await import('@form8ion/javascript');
  ({
    BASE_DETAILS: jsBaseDetailsQuestionNames,
    PROJECT_TYPE_PLUGIN: jsProjectTypePluginQuestionNames
  } = jsPromptConstants.questionNames);
  ({projectTypes} = await import('@form8ion/javascript-core'));
});

Given('the project is a Hapi application', async function () {
  this.setAnswerFor(jsBaseDetailsQuestionNames.PROJECT_TYPE, projectTypes.APPLICATION);
  this.setAnswerFor(jsProjectTypePluginQuestionNames.PROJECT_TYPE_CHOICE, 'Hapi');
});

Then('the Hapi server is configured', async function () {
  assert.isTrue(await fileExists(`${this.projectRoot}/src/server/index.js`));
  assert.isTrue(await fileExists(`${this.projectRoot}/src/server/server.js`));
  assert.isTrue(await fileExists(`${this.projectRoot}/src/server/manifest.js`));
});

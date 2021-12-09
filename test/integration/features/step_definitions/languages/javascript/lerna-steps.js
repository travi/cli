import {promises as fs} from 'fs';
import {Before, Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';

let jsQuestionNames, projectTypes;

Before(function () {
  ({questionNames: jsQuestionNames} = require('@form8ion/javascript'));
  ({projectTypes} = require('@form8ion/javascript-core'));
});

Given('the project is a monorepo', async function () {
  this.setAnswerFor(jsQuestionNames.PROJECT_TYPE, projectTypes.MONOREPO);
  this.setAnswerFor(jsQuestionNames.PROJECT_TYPE_CHOICE, 'Lerna');
});

Then('the lerna details are configured', async function () {
  const {version, npmClient} = JSON.parse(await fs.readFile(`${process.cwd()}/lerna.json`, 'utf-8'));

  assert.equal(version, 'independent');
  assert.equal(npmClient, 'npm');
});

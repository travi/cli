import {promises as fs} from 'fs';
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

Given('the project is a monorepo', async function () {
  this.setAnswerFor(jsBaseDetailsQuestionNames.PROJECT_TYPE, projectTypes.MONOREPO);
  this.setAnswerFor(jsProjectTypePluginQuestionNames.PROJECT_TYPE_CHOICE, 'Lerna');
});

Then('the lerna details are configured', async function () {
  const {version, npmClient} = JSON.parse(await fs.readFile(`${process.cwd()}/lerna.json`, 'utf-8'));

  assert.equal(version, 'independent');
  assert.equal(npmClient, 'npm');
});

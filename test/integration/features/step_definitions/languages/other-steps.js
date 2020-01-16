import {questionNames} from '@travi/project-scaffolder';
import {Given, Then} from 'cucumber';
import {assert} from 'chai';
import {exists} from 'mz/fs';

Given(/^the project language should be Other$/, async function () {
  this.setAnswerFor(questionNames.PROJECT_TYPE, 'Other');
});

Then(/^core ignores are defined$/, async function () {
  assert.isTrue(await exists(`${process.cwd()}/.editorconfig`));
  assert.isTrue(await exists(`${process.cwd()}/README.md`));
});

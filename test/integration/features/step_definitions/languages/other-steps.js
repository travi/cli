import {Given, Then} from 'cucumber';
import {assert} from 'chai';
import bddStdIn from 'bdd-stdin';
import {exists} from 'mz/fs';
import {projectDescriptionAnswer, projectNameAnswer} from '../common-steps';

Given(/^the project language should be Other$/, async function () {
  this.setAnswerFor('projectType', bddStdIn.keys.down);
  this.setAnswerFor('gitRepo', '\n');

  bddStdIn(
    projectNameAnswer, '\n',
    projectDescriptionAnswer, '\n',
    '\n',
    '\n',
    this.getAnswerFor('gitRepo'),
    '\n',
    '\n',
    this.getAnswerFor('projectType'), bddStdIn.keys.down, bddStdIn.keys.down, '\n'
    // bddStdIn.keys.up, '\n',
    // '\n',
    // '\n',
    // '\n',
    // 'n', '\n',
    // 'n', '\n'
  );
});

Then(/^core ignores are defined$/, async function () {
  assert.isTrue(await exists(`${process.cwd()}/.editorconfig`));
  assert.isTrue(await exists(`${process.cwd()}/README.md`));
});

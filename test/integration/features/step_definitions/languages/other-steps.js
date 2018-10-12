import {Given} from 'cucumber';
import bddStdIn from 'bdd-stdin';

Given('the project language should be Other', async function () {
  this.setAnswerFor('projectType', bddStdIn.keys.down);
  this.setAnswerFor('gitRepo', '\n');

  bddStdIn(
    'project-name', '\n',
    'some project description', '\n',
    '\n',
    '\n',
    this.getAnswerFor('gitRepo'),
    this.getAnswerFor('projectType'), '\n',
    '\n',
    '\n',
    bddStdIn.keys.up, '\n',
    '\n',
    '\n',
    '\n',
    'n', '\n',
    'n', '\n'
  );
});

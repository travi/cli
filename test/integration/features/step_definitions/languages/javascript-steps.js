import {Given, Then} from 'cucumber';
import {assert} from 'chai';
import {readFile} from 'mz/fs';
import bddStdIn from 'bdd-stdin';

Given(/^the project language should be JavaScript$/, async function () {
  this.setAnswerFor('projectType', '\n');
  this.setAnswerFor('gitRepo', '\n');

  bddStdIn(
    'project-name', '\n',
    'some project description',
    '\n',
    '\n',
    this.getAnswerFor('gitRepo'),
    '\n',
    '\n',
    this.getAnswerFor('projectType'),
    '\n',
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

Then(/^JavaScript ignores are defined$/, async function () {
  const gitIgnore = await readFile(`${process.cwd()}/.gitignore`);

  assert.equal(gitIgnore.toString(), `/node_modules/
/lib/
/coverage/
/.nyc_output/

.eslintcache`);
});

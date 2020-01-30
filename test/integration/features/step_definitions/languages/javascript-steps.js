import {promises} from 'fs';
import {exists} from 'mz/fs';
import {Before, Given, Then} from 'cucumber';
import {assert} from 'chai';
import any from '@travi/any';

function versionSegment() {
  return any.integer({max: 20});
}

const majorVersion = versionSegment();

function semverStringFactory() {
  return `v${majorVersion}.${versionSegment()}.${versionSegment()}`;
}

let questionNames;

Before(function () {
  questionNames = require('@travi/project-scaffolder').questionNames;

  this.shell.exec = () => undefined;

  this.sinonSandbox.stub(this.shell, 'exec');
});

Given(/^the project language should be JavaScript$/, async function () {
  this.setAnswerFor(questionNames.PROJECT_TYPE, 'JavaScript');

  this.shell.exec.withArgs('npm test').yields(0);
});

Given(/^nvm is properly configured$/, function () {
  const latestLtsVersion = semverStringFactory();

  this.shell.exec
    .withArgs('. ~/.nvm/nvm.sh && nvm ls-remote --lts')
    .yields(0, [...any.listOf(semverStringFactory), latestLtsVersion, ''].join('\n'));
  this.shell.exec.withArgs('. ~/.nvm/nvm.sh && nvm install').yields(0);
});

Then(/^JavaScript ignores are defined$/, async function () {
  const gitIgnore = await promises.readFile(`${process.cwd()}/.gitignore`);

  assert.equal(gitIgnore.toString(), `/node_modules/
/lib/
/coverage/
/.nyc_output/

.eslintcache`);
});

Then(/^the core JavaScript files are present$/, async function () {
  assert.isTrue(await exists(`${process.cwd()}/package.json`));
});

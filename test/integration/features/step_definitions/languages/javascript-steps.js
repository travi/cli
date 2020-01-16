import {questionNames} from '@travi/project-scaffolder';
import {Given, Then} from 'cucumber';
import {assert} from 'chai';
import {promises} from 'fs';

Given(/^the project language should be JavaScript$/, async function () {
  this.setAnswerFor(questionNames.PROJECT_TYPE, 'JavaScript');
});

Then(/^JavaScript ignores are defined$/, async function () {
  const gitIgnore = await promises.readFile(`${process.cwd()}/.gitignore`);

  assert.equal(gitIgnore.toString(), `/node_modules/
/lib/
/coverage/
/.nyc_output/

.eslintcache`);
});

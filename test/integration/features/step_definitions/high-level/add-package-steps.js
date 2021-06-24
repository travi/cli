import {promises as fs} from 'fs';
import parse from 'mdast-util-from-markdown';
import find from 'unist-util-find';
import {Given, Then} from '@cucumber/cucumber';
import td from 'testdouble';
import {assert} from 'chai';

async function assertReadmeDetailsArePopulatedProperly(projectName) {
  const readmeTree = parse(await fs.readFile(`${process.cwd()}/packages/${projectName}/README.md`, 'utf-8'));

  assert.isDefined(find(
    readmeTree,
    {type: 'heading', depth: 2, children: [{type: 'text', value: 'Table of Contents'}]}
  ));
  assert.isDefined(find(readmeTree, {type: 'heading', depth: 2, children: [{type: 'text', value: 'Usage'}]}));
  assert.isDefined(find(readmeTree, {type: 'heading', depth: 2, children: [{type: 'text', value: 'Contributing'}]}));
}

Given('a lerna monorepo exists', async function () {
  this.monorepoType = 'lerna';
  const huskyVersionError = new Error();
  huskyVersionError.stdout = JSON.stringify({});
  huskyVersionError.command = 'npm ls husky --json';
  huskyVersionError.exitCode = 1;

  td.when(this.execa('npm', ['ls', 'husky', '--json'])).thenReject(huskyVersionError);
  td.when(this.execa('npm run generate:md && npm test', {shell: true})).thenReturn({stdout: {pipe: () => undefined}});
});

Then('the package will have repository details defined', async function () {
  assert.deepEqual(
    JSON.parse(await fs.readFile(`${process.cwd()}/packages/${this.projectName}/package.json`, 'utf-8')).repository,
    {
      directory: `packages/${this.projectName}`,
      type: 'git',
      url: `https://github.com/${this.githubUser}/${this.projectName}.git`
    }
  );
  await assertReadmeDetailsArePopulatedProperly(this.projectName);
});

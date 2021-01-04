import {promises as fs} from 'fs';
import {Given, Then} from 'cucumber';
import td from 'testdouble';
import {assert} from 'chai';

Given('a lerna monorepo exists', async function () {
  this.monorepoType = 'lerna';
  td.when(this.execa('npm', ['ls', 'husky', '--json'])).thenResolve({stdout: JSON.stringify({})});
});

Then('the package will have repository details defined', async function () {
  assert.deepEqual(
    JSON.parse(await fs.readFile(`${process.cwd()}/packages/${this.projectName}/package.json`)).repository,
    {
      directory: `packages/${this.projectName}`,
      type: 'git',
      url: `https://github.com/${this.githubUser}/${this.projectName}.git`
    }
  );
});

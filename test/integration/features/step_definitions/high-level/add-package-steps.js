import {promises as fs} from 'fs';
import {Given, Then} from 'cucumber';
import td from 'testdouble';
import {assert} from 'chai';

Given('a lerna monorepo exists', async function () {
  await fs.writeFile(
    `${process.cwd()}/package.json`,
    JSON.stringify({repository: `${this.githubUser}/${this.projectName}`})
  );
  await fs.writeFile(`${process.cwd()}/lerna.json`, JSON.stringify({}));
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

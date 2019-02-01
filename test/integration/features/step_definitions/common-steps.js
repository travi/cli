import {readdir, readFile} from 'mz/fs';
import {resolve} from 'path';
import {After, Before, setWorldConstructor, When} from 'cucumber';

import stubbedFs from 'mock-fs';
import {World} from '../support/world';
import action from '../../../../src/action';
import {githubToken} from './vcs/github-api-steps';

const pathToNodeModules = [__dirname, '../../../../', 'node_modules/'];

setWorldConstructor(World);

function loadOctokitFiles(octokitFiles) {
  return octokitFiles
    .map(file => readFile(resolve(...pathToNodeModules, 'octokit-pagination-methods/lib/', file)));
}

function buildOctokitFileMap(octokitFiles) {
  return (acc, fileContents, index) => ({
    ...acc,
    [octokitFiles[index]]: fileContents
  });
}

Before(async () => {
  // work around for overly aggressive mock-fs, see:
  // https://github.com/tschaub/mock-fs/issues/213#issuecomment-347002795
  require('mock-stdin'); // eslint-disable-line import/no-extraneous-dependencies

  const octokitFiles = await readdir(resolve(...pathToNodeModules, 'octokit-pagination-methods/lib/'));
  stubbedFs({
    [`${process.env.HOME}/.netrc`]: `machine github.com\n  login ${githubToken}`,
    node_modules: {
      'octokit-pagination-methods': {
        lib: (await Promise.all(loadOctokitFiles(octokitFiles))).reduce(buildOctokitFileMap(octokitFiles), {})
      },
      '@travi': {
        'project-scaffolder': {
          templates: {
            'editorconfig.txt': await readFile(resolve(
              ...pathToNodeModules,
              '@travi/project-scaffolder/templates/editorconfig.txt'
            )),
            'README.mustache': await readFile(resolve(
              ...pathToNodeModules,
              '@travi/project-scaffolder/templates/README.mustache'
            ))
          }
        }
      }
    }
  });
});

After(() => stubbedFs.restore());

When(/^the project is scaffolded$/, async function () {
  await action();
});

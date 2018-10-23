import {readFile} from 'mz/fs';
import {resolve} from 'path';
import {Before, After, When, setWorldConstructor} from 'cucumber';
import stubbedFs from 'mock-fs';
import {World} from '../support/world';
import action from '../../../../src/action';

setWorldConstructor(World);

Before(async () => {
  // work around for overly aggressive mock-fs, see:
  // https://github.com/tschaub/mock-fs/issues/213#issuecomment-347002795
  require('mock-stdin'); // eslint-disable-line import/no-extraneous-dependencies

  stubbedFs({
    node_modules: {
      '@travi': {
        'project-scaffolder': {
          templates: {
            'editorconfig.txt': await readFile(resolve(
              __dirname,
              '../../../../',
              'node_modules/',
              '@travi/project-scaffolder/templates/editorconfig.txt'
            )),
            'README.mustache': await readFile(resolve(
              __dirname,
              '../../../../',
              'node_modules/',
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

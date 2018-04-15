import {readFile} from 'mz/fs';
import {resolve} from 'path';
import {Before, After, When} from 'cucumber';
import stubbedFs from 'mock-fs';
import scaffold from '../../../../packages/project/src/scaffolder';

Before(async () => {
  const projectTemplatePath = '../../../../packages/project/templates';

  // work around for overly aggressive mock-fs, see:
  // https://github.com/tschaub/mock-fs/issues/213#issuecomment-347002795
  require('mock-stdin'); // eslint-disable-line import/no-extraneous-dependencies

  stubbedFs({
    packages: {
      project: {
        templates: {
          'README.mustache': await readFile(resolve(__dirname, projectTemplatePath, './README.mustache'))
        }
      }
    }
  });
});

After(() => stubbedFs.restore());

When('the project is scaffolded', async function () {
  await scaffold();
});

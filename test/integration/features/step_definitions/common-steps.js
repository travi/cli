import {readFile} from 'mz/fs';
import {resolve} from 'path';
import {Before, After, When} from 'cucumber';
import stubbedFs from 'mock-fs';
import {scaffold} from '@travi/project-scaffolder';

Before(async () => {
  const projectTemplatePath = '@travi/project-scaffolder/templates';

  // work around for overly aggressive mock-fs, see:
  // https://github.com/tschaub/mock-fs/issues/213#issuecomment-347002795
  require('mock-stdin'); // eslint-disable-line import/no-extraneous-dependencies

  stubbedFs({
    node_modules: {
      '@travi': {
        'project-scaffolder': {
          templates: {
            'README.mustache': await readFile((
              resolve(__dirname, '../../../../', 'node_modules', projectTemplatePath, './README.mustache')
            ))
          }
        }
      }
    }
  });
});

After(() => stubbedFs.restore());

When('the project is scaffolded', async function () {
  await scaffold();
});

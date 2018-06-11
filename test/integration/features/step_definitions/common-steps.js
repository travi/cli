import {Before, After, When, setWorldConstructor} from 'cucumber';
import stubbedFs from 'mock-fs';
import {World} from '../support/world';
import action from '../../../../src/action';

setWorldConstructor(World);

Before(async () => {
  // work around for overly aggressive mock-fs, see:
  // https://github.com/tschaub/mock-fs/issues/213#issuecomment-347002795
  require('mock-stdin'); // eslint-disable-line import/no-extraneous-dependencies
  // require('joi/lib/schemas');
});

After(() => stubbedFs.restore());

When('the project is scaffolded', async function () {
  await action();
});

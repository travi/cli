import fs from 'mz/fs';
import any from '@travi/any';
import sinon from 'sinon';
import {assert} from 'chai';
import scaffoldGit from '../../../src/scaffold-project/git';

suite('scaffold git', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(fs, 'writeFile');
  });

  teardown(() => sandbox.restore());

  test('that the git repo is initialized', () => {
    const projectRoot = any.string();
    fs.writeFile.resolves();

    return scaffoldGit({projectRoot}).then(() => assert.calledWith(
      fs.writeFile,
      `${projectRoot}/.gitattributes`,
      '* text=auto'
    ));
  });
});

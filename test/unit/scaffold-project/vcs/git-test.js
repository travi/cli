import fs from 'mz/fs';
import {Repository as gitRepository} from 'nodegit';
import any from '@travi/any';
import sinon from 'sinon';
import {assert} from 'chai';
import scaffoldGit from '../../../../src/scaffold-project/vcs/git';

suite('scaffold git', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(fs, 'writeFile');
    sandbox.stub(gitRepository, 'init');
  });

  teardown(() => sandbox.restore());

  test('that the git repo is initialized', () => {
    const projectRoot = any.string();
    fs.writeFile.resolves();
    gitRepository.init.resolves();

    return scaffoldGit({projectRoot}).then(() => {
      assert.calledWith(gitRepository.init, projectRoot, 0);
      assert.calledWith(fs.writeFile, `${projectRoot}/.gitattributes`, '* text=auto');
    });
  });
});

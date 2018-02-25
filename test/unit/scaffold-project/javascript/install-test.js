import shell from 'shelljs';
import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import npmInstall from '../../../../src/scaffold-project/javascript/install';

suite('npm install', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(shell, 'exec');

    shell.exec.yields(0);
  });

  teardown(() => sandbox.restore());

  test('that a non-zero exit code results in a rejection', () => {
    shell.exec.yields(1);

    return assert.isRejected(npmInstall(any.listOf(any.word)));
  });

  test('that `npm install` is not run when no dependencies need to be installed', async () => {
    await npmInstall([]);

    assert.neverCalledWith(shell.exec, 'npm install  --save-dev', {silent: true});
  });

  suite('devDependencies', () => {
    test('that devDependencies are installed', async () => {
      const devDependencies = any.listOf(any.word);

      await npmInstall(devDependencies);

      assert.calledWith(shell.exec, `npm install ${devDependencies.join(' ')} --save-dev`, {silent: true});
    });
  });
});

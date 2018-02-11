import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import configureProgram from '../../src/program';
import * as scaffoldSubCommand from '../../src/scaffold-project/sub-command';

suite('cli', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(scaffoldSubCommand, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the version is defined based on the package file', () => {
    const version = any.string();
    const versionStub = sinon.stub();
    const program = {...any.simpleObject(), version: versionStub};

    configureProgram(program, {version});

    assert.calledWith(versionStub, version);
    assert.calledWith(scaffoldSubCommand.default, program);
  });
});

import * as scaffoldSubCommand from '@travi/scaffolder-sub-command';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import configureProgram from '../../src/program';
import * as travisTokens from '../../src/travis-tokens/sub-command';

suite('cli', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(scaffoldSubCommand, 'addSubCommand');
    sandbox.stub(travisTokens, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the version is defined based on the package file', () => {
    const version = any.string();
    const versionStub = sinon.stub();
    const program = {...any.simpleObject(), version: versionStub};

    configureProgram(program, {version});

    assert.calledWith(versionStub, version);
    assert.calledWith(scaffoldSubCommand.addSubCommand, program);
    assert.calledWith(travisTokens.default, program);
  });
});

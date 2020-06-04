import * as scaffoldSubCommand from '@travi/scaffolder-sub-command';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import * as travisTokens from './travis-tokens/sub-command';
import * as lift from './lift/sub-command';
import * as skiPatrol from './ski-patrol/sub-command';
import * as shuttle from './shuttle/sub-command';
import configureProgram from './program';

suite('cli', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(scaffoldSubCommand, 'addSubCommand');
    sandbox.stub(travisTokens, 'default');
    sandbox.stub(lift, 'default');
    sandbox.stub(skiPatrol, 'default');
    sandbox.stub(shuttle, 'default');
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
    assert.calledWith(lift.default, program);
    assert.calledWith(skiPatrol.default, program);
    assert.calledWith(shuttle.default, program);
  });
});

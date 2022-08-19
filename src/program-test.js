import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import * as scaffoldSubCommand from './scaffolder/sub-command';
import * as lift from './lift/sub-command';
import * as skiPatrol from './ski-patrol/sub-command';
import * as shuttle from './shuttle/sub-command';
import * as snoCat from './sno-cat/sub-command';
import * as addPackage from './add-package/sub-command';
import configureProgram from './program';

suite('cli', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(scaffoldSubCommand, 'default');
    sandbox.stub(lift, 'default');
    sandbox.stub(skiPatrol, 'default');
    sandbox.stub(shuttle, 'default');
    sandbox.stub(snoCat, 'default');
    sandbox.stub(addPackage, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the version is defined based on the package file', () => {
    const version = any.string();
    const versionStub = sinon.stub();
    const program = {...any.simpleObject(), version: versionStub};

    configureProgram(program, {version});

    assert.calledWith(versionStub, version);
    assert.calledWith(scaffoldSubCommand.default, program);
    assert.calledWith(lift.default, program);
    assert.calledWith(skiPatrol.default, program);
    assert.calledWith(shuttle.default, program);
    assert.calledWith(snoCat.default, program);
    assert.calledWith(addPackage.default, program);
  });
});

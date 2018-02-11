import program from 'commander';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import configureProgram from '../../src/program';

suite('cli', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(program, 'version');
  });

  teardown(() => sandbox.restore());

  test('that the version is defined based on the package file', () => {
    const version = any.string();

    assert.calledWith(configureProgram({version}).version, version);
  });
});

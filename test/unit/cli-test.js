import program from 'commander';
import pkg from '../../package.json';
import sinon from 'sinon';
import {assert} from 'chai';

suite('cli', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(program, 'version');
  });

  test('that the version is defined based on the package file', () => {
    require('../../src');

    assert.calledWith(program.version, pkg.version);
  });
});

import * as tokenUpdater from 'travis-token-updater';
import sinon from 'sinon';
import {assert} from 'chai';
import rollTokenAction from '../../../src/travis-tokens/action';

suite('Travis-CI token roller action', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(tokenUpdater, 'update');
  });

  teardown(() => sandbox.restore());

  test('that the token rolling is initiated', () => {
    rollTokenAction();

    assert.calledOnce(tokenUpdater.update);
  });
});

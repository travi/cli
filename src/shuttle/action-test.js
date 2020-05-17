import * as shuttle from '@form8ion/shuttle';
import sinon from 'sinon';
import {assert} from 'chai';
import shuttleAction from './action';

suite('ski-patrol action', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(shuttle, 'shuttle');
  });

  teardown(() => sandbox.restore());

  test('that ski-patrol assesses the project', async () => {
    await shuttleAction();

    assert.calledOnce(shuttle.shuttle);
  });
});

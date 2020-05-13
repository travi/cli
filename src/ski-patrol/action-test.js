import * as skiPatrol from '@form8ion/ski-patrol';
import sinon from 'sinon';
import {assert} from 'chai';
import skiPatrolAction from './action';

suite('ski-patrol action', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(skiPatrol, 'patrol');
  });

  teardown(() => sandbox.restore());

  test('that ski-patrol assesses the project', async () => {
    await skiPatrolAction();

    assert.calledOnce(skiPatrol.patrol);
  });
});

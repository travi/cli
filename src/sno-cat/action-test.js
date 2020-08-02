import * as snoCat from '@form8ion/sno-cat-ink';
import sinon from 'sinon';
import {assert} from 'chai';
import snoCatAction from './action';

suite('sno-cat action', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(snoCat, 'groom');
  });

  teardown(() => sandbox.restore());

  test('that sno-cat grooms the notifications', async () => {
    await snoCatAction();

    assert.calledOnce(snoCat.groom);
  });
});

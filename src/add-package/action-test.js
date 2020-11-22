import * as adder from '@form8ion/add-package-to-monorepo';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import addPackageAction from './action';

suite('add-package action', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(adder, 'scaffold');
  });

  teardown(() => sandbox.restore());

  test('that a package is added to the monorepo', async () => {
    const additionResults = any.simpleObject();
    adder.scaffold.withArgs({}).resolves(additionResults);

    assert.equal(await addPackageAction(), additionResults);
  });
});

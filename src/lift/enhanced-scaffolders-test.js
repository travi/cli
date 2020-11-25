import * as jsCore from '@form8ion/javascript-core';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import {unitTesting} from './enhanced-scaffolders';
import {unitTestFrameworks} from '../common/test-frameworks';

suite('enhanced lift scaffolders', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(jsCore, 'scaffoldUnitTesting');
  });

  teardown(() => sandbox.restore());

  test('that the frameworks are provided to the unit test framework scaffolder', async () => {
    const results = any.simpleObject();
    const options = any.simpleObject();
    jsCore.scaffoldUnitTesting.withArgs({...options, frameworks: unitTestFrameworks}).resolves(results);

    assert.equal(await unitTesting(options), results);
  });
});

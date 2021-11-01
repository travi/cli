import * as js from '@form8ion/javascript';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import {unitTesting} from './enhanced-scaffolders';
import {unitTestFrameworks} from '../common/test-frameworks';

suite('enhanced lift scaffolders', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(js, 'scaffoldUnitTesting');
  });

  teardown(() => sandbox.restore());

  test('that the frameworks are provided to the unit test framework scaffolder', async () => {
    const results = any.simpleObject();
    const options = any.simpleObject();
    js.scaffoldUnitTesting.withArgs({...options, frameworks: unitTestFrameworks}).resolves(results);

    assert.equal(await unitTesting(options), results);
  });
});

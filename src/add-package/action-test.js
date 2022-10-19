import adder from '@form8ion/add-package-to-monorepo';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import * as jsOptions from '../common/javascript-options';
import addPackageAction from './action';

suite('add-package action', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(adder, 'scaffold');
    sandbox.stub(jsOptions, 'defineScaffoldJavascriptOptions');
  });

  teardown(() => sandbox.restore());

  test('that a package is added to the monorepo', async () => {
    const additionResults = any.simpleObject();
    const options = any.simpleObject();
    const decisions = any.simpleObject();
    jsOptions.defineScaffoldJavascriptOptions.withArgs(decisions).returns(options);
    adder.scaffold.withArgs(options).resolves(additionResults);

    assert.equal(await addPackageAction(decisions), additionResults);
  });
});

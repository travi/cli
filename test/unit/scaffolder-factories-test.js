import * as javascriptScaffolder from '@travi/javascript-scaffolder';
import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';
import {javascript} from '../../src/scaffolder-factories';

suite('scaffolder factories', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(javascriptScaffolder, 'scaffold');
  });

  teardown(() => sandbox.restore());

  test('that the custom properties are passed along with the provided options', () => {
    const options = any.simpleObject();
    const output = any.simpleObject();

    javascriptScaffolder.scaffold.withArgs({...options, eslintConfigPrefix: '@travi/travi'}).resolves(output);

    return assert.becomes(javascript()(options), output);
  });
});

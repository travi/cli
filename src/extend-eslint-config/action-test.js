import * as eslintConfigExtender from '@form8ion/eslint-config-extender';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import extendAction from './action';
import {javascriptScaffolderFactory} from '../common/enhanced-scaffolders';
import * as commonOptions from '../common/project-options';

suite('extend-eslint-config action', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(eslintConfigExtender, 'extendEslintConfig');
    sandbox.stub(commonOptions, 'defineScaffoldProjectOptions');
  });

  teardown(() => sandbox.restore());

  test('that the extend-eslint-config command is defined', async () => {
    const decisions = any.simpleObject();
    const scaffoldOptions = any.simpleObject();
    const extendResults = any.simpleObject();
    commonOptions.defineScaffoldProjectOptions.withArgs(decisions).returns(scaffoldOptions);
    eslintConfigExtender.extendEslintConfig
      .withArgs(scaffoldOptions, javascriptScaffolderFactory)
      .resolves(extendResults);

    assert.equal(await extendAction(decisions), extendResults);
  });
});

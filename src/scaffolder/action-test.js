import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import * as projectScaffolder from '@travi/project-scaffolder';
import * as commonOptions from '../common/options';
import getAction from './action';

suite('action', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(projectScaffolder, 'scaffold');
    sandbox.stub(console, 'error');
    sandbox.stub(commonOptions, 'defineScaffoldProjectOptions');
  });

  teardown(() => {
    process.exitCode = 0;
    sandbox.restore();
  });

  test('that language and vcs-host scaffolders are provided to the project scaffolder', async () => {
    const decisions = any.simpleObject();
    const scaffoldOptions = any.simpleObject();
    const scaffoldResults = any.simpleObject();
    commonOptions.defineScaffoldProjectOptions.withArgs(decisions).returns(scaffoldOptions);
    projectScaffolder.scaffold.withArgs(scaffoldOptions).resolves(scaffoldResults);

    assert.equal(await getAction(decisions)(), scaffoldResults);
  });

  test('that the exit-code is set to `1` upon failure when a code is not provided', async () => {
    const error = new Error();
    projectScaffolder.scaffold.rejects(error);

    await getAction()();

    assert.equal(process.exitCode, 1);
    assert.calledWith(console.error, error);      // eslint-disable-line no-console
  });

  test('that the exit-code is set to the provided code upon failure when provided', async () => {
    const code = any.integer();
    const error = new Error();
    error.data = {code};
    projectScaffolder.scaffold.rejects(error);

    await getAction()();

    assert.equal(process.exitCode, code);
  });
});

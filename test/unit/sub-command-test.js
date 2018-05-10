import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import * as projectScaffolder from '@travi/project-scaffolder';
import * as scaffolder from '../../src/sub-command';

suite('scaffold-project sub-command', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(projectScaffolder, 'scaffold');
    sandbox.stub(console, 'error');
  });

  teardown(() => {
    process.exitCode = 0;
    sandbox.restore();
  });

  test('that the exit-code is set to `1` upon failure when a code is not provided', () => {
    const command = sinon.stub();
    const description = sinon.stub();
    const action = sinon.stub();
    command.withArgs('scaffold').returns({description});
    description.withArgs('scaffold a new project').returns({action});
    const error = new Error();
    projectScaffolder.scaffold.rejects(error);

    scaffolder.addSubCommand({command});

    return action.getCall(0).args[0]().then(() => {
      assert.equal(process.exitCode, 1);
      assert.calledWith(console.error, error);      // eslint-disable-line no-console
    });
  });

  test('that the exit-code is set to the provided code upon failure when provided', () => {
    const command = sinon.stub();
    const description = sinon.stub();
    const action = sinon.stub();
    const code = any.integer();
    command.withArgs('scaffold').returns({description});
    description.withArgs('scaffold a new project').returns({action});
    const error = new Error();
    error.data = {code};
    projectScaffolder.scaffold.rejects(error);

    scaffolder.addSubCommand({command});

    return action.getCall(0).args[0]().then(() => assert.equal(process.exitCode, code));
  });
});

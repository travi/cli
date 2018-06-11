import sinon from 'sinon';
import {assert} from 'chai';
import {addSubCommand} from '../../src/sub-command';
import scaffolderAction from '../../src/action';

suite('scaffold-project sub-command', () => {
  let sandbox, command, description, action;

  setup(() => {
    sandbox = sinon.createSandbox();

    command = sinon.stub();
    description = sinon.stub();
    action = sinon.stub();

    command.withArgs('scaffold').returns({description});
    description.withArgs('scaffold a new project').returns({action});
  });

  teardown(() => {
    process.exitCode = 0;
    sandbox.restore();
  });

  test('that the action is provided to the sub-command', () => {
    addSubCommand({command});

    assert.calledWith(action, scaffolderAction);
  });
});

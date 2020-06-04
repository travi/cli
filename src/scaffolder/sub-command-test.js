import sinon from 'sinon';
import {assert} from 'chai';
import scaffolderCommand from './sub-command';
import * as scaffolderActionFactory from './action';

suite('scaffold-project sub-command', () => {
  let sandbox, command, description, action;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(scaffolderActionFactory, 'default');

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
    const scaffolderAction = () => undefined;
    scaffolderActionFactory.default.returns(scaffolderAction);

    scaffolderCommand({command});

    assert.calledWith(action, scaffolderAction);
  });
});

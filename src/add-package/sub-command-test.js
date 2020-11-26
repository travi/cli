import sinon from 'sinon';
import {assert} from 'chai';
import addPackageAction from './action';
import addPackageCommand from './sub-command';

suite('add-package sub-command', () => {
  test('that the add-package command is available', () => {
    const command = sinon.stub();
    const description = sinon.stub();
    const action = sinon.stub();
    command.withArgs('add-package').returns({description});
    description.withArgs('Add a JavaScript package to an existing monorepo').returns({action});

    addPackageCommand({command});

    assert.calledWith(action, addPackageAction);
  });
});

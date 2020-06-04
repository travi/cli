import sinon from 'sinon';
import {assert} from 'chai';
import liftAction from './action';
import liftCommand from './sub-command';

suite('lift sub-command', () => {
  test('that the lift command is available', () => {
    const command = sinon.stub();
    const description = sinon.stub();
    const action = sinon.stub();
    command.withArgs('lift').returns({description});
    description.withArgs('Lift an existing project with additional functionality').returns({action});

    liftCommand({command});

    assert.calledWith(action, liftAction);
  });
});

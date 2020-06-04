import sinon from 'sinon';
import {assert} from 'chai';
import skiPatrolAction from './action';
import skiPatrolCommand from './sub-command';

suite('ski-patrol sub-command', () => {
  test('that the ski-patrol command is available', () => {
    const command = sinon.stub();
    const description = sinon.stub();
    const action = sinon.stub();
    command.withArgs('ski-patrol').returns({description});
    description.withArgs('Assess an existing project for issues to fix').returns({action});

    skiPatrolCommand({command});

    assert.calledWith(action, skiPatrolAction);
  });
});

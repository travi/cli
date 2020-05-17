import sinon from 'sinon';
import {assert} from 'chai';
import shuttleAction from './action';
import shuttleCommand from './sub-command';

suite('shuttle sub-command', () => {
  test('that the shuttle command is available', () => {
    const command = sinon.stub();
    const description = sinon.stub();
    const action = sinon.stub();
    command.withArgs('shuttle').returns({description});
    description.withArgs('Shuttle a project to a different organization').returns({action});

    shuttleCommand({command});

    assert.calledWith(action, shuttleAction);
  });
});

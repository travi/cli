import sinon from 'sinon';
import {assert} from 'chai';
import snoCatAction from './action';
import snoCatCommand from './sub-command';

suite('sno-cat sub-command', () => {
  test('that the sno-cat command is available', () => {
    const command = sinon.stub();
    const description = sinon.stub();
    const action = sinon.stub();
    command.withArgs('sno-cat').returns({description});
    description.withArgs('Groom the GitHub notification list').returns({action});

    snoCatCommand({command});

    assert.calledWith(action, snoCatAction);
  });
});

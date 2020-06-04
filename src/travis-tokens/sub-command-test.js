import sinon from 'sinon';
import {assert} from 'chai';
import rollTokenAction from './action';
import rollTokenCommand from './sub-command';

suite('Travis-CI token roller sub-command', () => {
  test('that the token rolling is initiated', () => {
    const command = sinon.stub();
    const description = sinon.stub();
    const action = sinon.stub();
    command.withArgs('travis-tokens').returns({description});
    description.withArgs('update a token across projects on Travis-CI').returns({action});

    rollTokenCommand({command});

    assert.calledWith(action, rollTokenAction);
  });
});

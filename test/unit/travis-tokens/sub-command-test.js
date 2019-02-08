import sinon from 'sinon';
import {assert} from 'chai';
import rollTokenAction from '../../../src/travis-tokens/action';
import rollTokenCommand from '../../../src/travis-tokens/sub-command';

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

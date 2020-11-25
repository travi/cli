import sinon from 'sinon';
import {assert} from 'chai';
import extendAction from './action';
import liftCommand from './sub-command';

suite('extend-eslint-config sub-command', () => {
  test('that the extend-eslint-config command is available', () => {
    const command = sinon.stub();
    const description = sinon.stub();
    const action = sinon.stub();
    command.withArgs('extend-eslint-config').returns({description});
    description.withArgs('Extend a @form8ion shareable ESLint config').returns({action});

    liftCommand({command});

    assert.calledWith(action, extendAction);
  });
});

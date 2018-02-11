import sinon from 'sinon';
import {assert} from 'chai';
import scaffolder from '../../../src/scaffold-project/scaffolder';
import buildSubCommand from '../../../src/scaffold-project';

suite('scaffold-project sub-command', () => {
  test('that scaffold-project sub-command is configured', () => {
    const command = sinon.stub();
    const description = sinon.stub();
    const action = sinon.stub();
    command.withArgs('scaffold').returns({description});
    description.withArgs('scaffold a new project').returns({action});

    buildSubCommand({command});

    assert.calledWith(action, scaffolder);
  });
});

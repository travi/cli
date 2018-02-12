import inquirer from 'inquirer';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import scaffolder, {questionNames} from '../../../src/scaffold-project/scaffolder';

suite('project scaffolder', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(inquirer, 'prompt');
  });

  teardown(() => sandbox.restore());

  test('that the user is prompted for the necessary details', () => {
    inquirer.prompt.resolves();

    return scaffolder().then(() => assert.calledWith(
      inquirer.prompt,
      [
        {name: questionNames.PROJECT_NAME, message: 'What is the name of this project?'},
        {
          name: questionNames.GIT_REPO,
          type: 'confirm',
          default: true,
          message: 'Should a git repository be initialized?'
        },
        {
          name: questionNames.REPO_HOST,
          type: 'list',
          message: 'Where will the repository be hosted?',
          choices: ['GitHub', 'BitBucket', 'GitLab', 'KeyBase']
        }
      ]
    ));
  });
});

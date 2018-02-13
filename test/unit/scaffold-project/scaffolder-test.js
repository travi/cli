import inquirer from 'inquirer';
import path from 'path';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import * as readmeScaffolder from '../../../src/scaffold-project/readme';
import scaffolder, {questionNames} from '../../../src/scaffold-project/scaffolder';

suite('project scaffolder', () => {
  let sandbox;
  const projectPath = any.string();

  setup(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(inquirer, 'prompt');
    sandbox.stub(process, 'cwd');
    sandbox.stub(path, 'basename');
    sandbox.stub(readmeScaffolder, 'default');

    process.cwd.returns(projectPath);
  });

  teardown(() => sandbox.restore());

  test('that the user is prompted for the necessary details', () => {
    const directoryName = any.string();
    path.basename.withArgs(projectPath).returns(directoryName);
    inquirer.prompt.resolves({});

    return scaffolder().then(() => assert.calledWith(
      inquirer.prompt,
      [
        {name: questionNames.PROJECT_NAME, message: 'What is the name of this project?', default: directoryName},
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

  test('that the readme is generated', () => {
    const projectName = any.string();
    inquirer.prompt.resolves({[questionNames.PROJECT_NAME]: projectName});
    readmeScaffolder.default.resolves();

    return scaffolder().then(() => assert.calledWith(
      readmeScaffolder.default,
      {projectName, projectRoot: projectPath}
    ));
  })
});

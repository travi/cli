import inquirer from 'inquirer';
import path from 'path';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import * as readmeScaffolder from '../../../src/scaffold-project/readme';
import * as gitScaffolder from '../../../src/scaffold-project/git';
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
    sandbox.stub(gitScaffolder, 'default');

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

  test('that project files are generated', () => {
    const projectName = any.string();
    inquirer.prompt.resolves({
      [questionNames.PROJECT_NAME]: projectName,
      [questionNames.GIT_REPO]: true
    });
    readmeScaffolder.default.resolves();
    gitScaffolder.default.resolves();

    return scaffolder().then(() => {
      assert.calledWith(gitScaffolder.default, {projectRoot: projectPath});
      assert.calledWith(readmeScaffolder.default, {projectName, projectRoot: projectPath});
    });
  });

  test('that the git repo is not initialized if not requested', () => {
    inquirer.prompt.resolves({
      [questionNames.GIT_REPO]: false
    });
    readmeScaffolder.default.resolves();

    return scaffolder().then(() => assert.notCalled(gitScaffolder.default));
  });
});

import inquirer from 'inquirer';
import path from 'path';
import fs from 'mz/fs';
import spdxLicenseList from 'spdx-license-list/simple';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import * as readmeScaffolder from '../../../src/scaffold-project/readme';
import * as gitScaffolder from '../../../src/scaffold-project/git';
import * as vcsHostScaffolder from '../../../src/scaffold-project/vcs-host';
import * as licenseScaffolder from '../../../src/scaffold-project/license';
import * as javascriptScaffolder from '../../../src/scaffold-project/javascript/scaffolder';
import scaffolder, {questionNames} from '../../../src/scaffold-project/scaffolder';
import {
  copyrightInformationShouldBeRequested,
  licenseChoicesShouldBePresented,
  unlicensedConfirmationShouldBePresented,
  vcsHostPromptShouldBePresented
} from '../../../src/scaffold-project/prompt-conditionals';

suite('project scaffolder', () => {
  let sandbox;
  const projectPath = any.string();
  const projectName = any.string();

  setup(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(inquirer, 'prompt');
    sandbox.stub(process, 'cwd');
    sandbox.stub(path, 'basename');
    sandbox.stub(readmeScaffolder, 'default');
    sandbox.stub(gitScaffolder, 'default');
    sandbox.stub(vcsHostScaffolder, 'default');
    sandbox.stub(licenseScaffolder, 'default');
    sandbox.stub(javascriptScaffolder, 'default');
    sandbox.stub(fs, 'copyFile');

    process.cwd.returns(projectPath);
    fs.copyFile.resolves();
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
          name: questionNames.DESCRIPTION,
          message: 'How should this project be described?'
        },
        {
          name: questionNames.VISIBILITY,
          message: 'Should this project be public or private?',
          type: 'list',
          choices: ['Public', 'Private'],
          default: 'Private'
        },
        {
          name: questionNames.UNLICENSED,
          message: 'Since this is a private project, should it be unlicensed?',
          type: 'confirm',
          when: unlicensedConfirmationShouldBePresented,
          default: true
        },
        {
          name: questionNames.LICENSE,
          message: 'How should this this project be licensed?',
          type: 'list',
          when: licenseChoicesShouldBePresented,
          choices: Array.from(spdxLicenseList),
          default: 'MIT'
        },
        {
          name: questionNames.COPYRIGHT_HOLDER,
          message: 'Who is the copyright holder of this project?',
          when: copyrightInformationShouldBeRequested,
          default: 'Matt Travi'
        },
        {
          name: questionNames.COPYRIGHT_YEAR,
          message: 'What is the copyright year?',
          when: copyrightInformationShouldBeRequested,
          default: new Date().getFullYear()
        },
        {
          name: questionNames.GIT_REPO,
          type: 'confirm',
          default: true,
          message: 'Should a git repository be initialized?'
        },
        {
          name: questionNames.REPO_HOST,
          type: 'list',
          when: vcsHostPromptShouldBePresented,
          message: 'Where will the repository be hosted?',
          choices: ['GitHub', 'BitBucket', 'GitLab', 'KeyBase']
        },
        {
          name: questionNames.PROJECT_TYPE,
          type: 'list',
          message: 'What type of project is this?',
          choices: ['JavaScript', 'Other']
        }
      ]
    ));
  });

  test('that project files are generated', () => {
    const license = any.string();
    const description = any.string();
    const year = any.word();
    const holder = any.sentence();
    const copyright = {year, holder};
    const repoHost = any.word();
    const vcs = any.simpleObject();
    inquirer.prompt.resolves({
      [questionNames.PROJECT_NAME]: projectName,
      [questionNames.GIT_REPO]: true,
      [questionNames.REPO_HOST]: repoHost,
      [questionNames.LICENSE]: license,
      [questionNames.DESCRIPTION]: description,
      [questionNames.COPYRIGHT_HOLDER]: holder,
      [questionNames.COPYRIGHT_YEAR]: year
    });
    readmeScaffolder.default.resolves();
    gitScaffolder.default.resolves();
    licenseScaffolder.default.resolves();
    vcsHostScaffolder.default.withArgs({host: repoHost, projectName}).resolves(vcs);

    return scaffolder().then(() => {
      assert.calledWith(gitScaffolder.default, {projectRoot: projectPath});
      assert.calledWith(
        readmeScaffolder.default,
        {projectName, projectRoot: projectPath, description, license, vcs}
      );
      assert.calledWith(licenseScaffolder.default, {projectRoot: projectPath, license, copyright});
      assert.calledWith(
        fs.copyFile,
        path.resolve(__dirname, '../../../', 'src/scaffold-project/templates', 'editorconfig.txt'),
        `${projectPath}/.editorconfig`
      );
      assert.notCalled(javascriptScaffolder.default);
    });
  });

  test('that the git repo is not initialized if not requested', () => {
    inquirer.prompt.resolves({
      [questionNames.GIT_REPO]: false
    });
    readmeScaffolder.default.resolves();

    return scaffolder().then(() => assert.notCalled(gitScaffolder.default));
  });

  test('that the javascript project scaffolder is run for a js project', () => {
    const visibility = any.boolean();
    inquirer.prompt.resolves({
      [questionNames.PROJECT_NAME]: projectName,
      [questionNames.PROJECT_TYPE]: 'JavaScript',
      [questionNames.VISIBILITY]: visibility
    });

    return scaffolder().then(() => assert.calledWith(javascriptScaffolder.default, {
      projectName,
      projectRoot: projectPath,
      visibility
    }));
  });
});

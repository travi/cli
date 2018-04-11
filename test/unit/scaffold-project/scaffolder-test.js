import inquirer from 'inquirer';
import path from 'path';
import fs from 'mz/fs';
import spdxLicenseList from 'spdx-license-list/simple';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import * as readmeScaffolder from '../../../src/scaffold-project/readme';
import * as gitScaffolder from '../../../src/scaffold-project/vcs/git';
import * as vcsHostScaffolder from '../../../src/scaffold-project/vcs/host';
import * as licenseScaffolder from '../../../src/scaffold-project/license';
import * as javascriptScaffolder from '../../../src/scaffold-project/javascript/scaffolder';
import * as travisScaffolder from '../../../src/scaffold-project/ci/travis';
import * as exec from '../../../third-party-wrappers/exec-as-promised';
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
  const vcs = any.simpleObject();
  const repoHost = any.word();
  const description = any.string();
  const license = any.string();
  const projectType = any.word();
  const licenseBadge = any.url();

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
    sandbox.stub(travisScaffolder, 'default');
    sandbox.stub(fs, 'copyFile');
    sandbox.stub(exec, 'default');

    process.cwd.returns(projectPath);
    fs.copyFile.resolves();
    licenseScaffolder.default.resolves({});
    travisScaffolder.default.resolves({});
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
        },
        {
          name: questionNames.CI,
          type: 'list',
          message: 'Which continuous integration service will be used?',
          choices: ['Travis', 'GitLab CI']
        }
      ]
    ));
  });

  test('that project files are generated', () => {
    const travisBadge = any.url();
    const year = any.word();
    const holder = any.sentence();
    const copyright = {year, holder};
    const visibility = any.word();
    inquirer.prompt.resolves({
      [questionNames.PROJECT_NAME]: projectName,
      [questionNames.PROJECT_TYPE]: projectType,
      [questionNames.GIT_REPO]: true,
      [questionNames.REPO_HOST]: repoHost,
      [questionNames.LICENSE]: license,
      [questionNames.DESCRIPTION]: description,
      [questionNames.COPYRIGHT_HOLDER]: holder,
      [questionNames.COPYRIGHT_YEAR]: year,
      [questionNames.VISIBILITY]: visibility,
      [questionNames.CI]: 'Travis'
    });
    readmeScaffolder.default.resolves();
    gitScaffolder.default.resolves();
    licenseScaffolder.default
      .withArgs({projectRoot: projectPath, license, copyright, vcs})
      .resolves({badge: licenseBadge});
    vcsHostScaffolder.default
      .withArgs({host: repoHost, projectName, projectRoot: projectPath, projectType})
      .resolves(vcs);
    travisScaffolder.default
      .withArgs({projectRoot: projectPath, projectType, vcs, visibility})
      .resolves({badge: travisBadge});

    return scaffolder().then(() => {
      assert.calledWith(gitScaffolder.default, {projectRoot: projectPath, ignore: {}});
      assert.calledWith(
        readmeScaffolder.default,
        {
          projectName,
          projectRoot: projectPath,
          description,
          license,
          badges: {consumer: {license: licenseBadge}, status: {ci: travisBadge}, contribution: {}}
        }
      );
      assert.calledWith(
        fs.copyFile,
        path.resolve(__dirname, '../../../', 'src/scaffold-project/templates', 'editorconfig.txt'),
        `${projectPath}/.editorconfig`
      );
      assert.notCalled(javascriptScaffolder.default);
    });
  });

  test('that the travis scaffolder is not run if travis was not chosen as the ci service', () => {
    inquirer.prompt.resolves({
      [questionNames.PROJECT_NAME]: projectName,
      [questionNames.PROJECT_TYPE]: projectType,
      [questionNames.GIT_REPO]: true,
      [questionNames.LICENSE]: license,
      [questionNames.DESCRIPTION]: description,
      [questionNames.CI]: any.word()
    });
    licenseScaffolder.default.resolves({badge: licenseBadge});

    return scaffolder().then(() => {
      assert.notCalled(travisScaffolder.default);
      assert.calledWith(
        readmeScaffolder.default,
        {
          projectName,
          projectRoot: projectPath,
          description,
          license,
          badges: {consumer: {license: licenseBadge}, status: {}, contribution: {}}
        }
      );
    });
  });

  test('that the badge lists passed to the readme are empty if none are defined', () => {
    licenseScaffolder.default.resolves({});
    inquirer.prompt.resolves({
      [questionNames.PROJECT_NAME]: projectName,
      [questionNames.LICENSE]: license,
      [questionNames.DESCRIPTION]: description,
      [questionNames.GIT_REPO]: false
    });
    readmeScaffolder.default.resolves();

    return scaffolder().then(() => assert.calledWith(
      readmeScaffolder.default,
      {
        projectName,
        projectRoot: projectPath,
        description,
        license,
        badges: {consumer: {}, status: {}, contribution: {}}
      }
    ));
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
    const ignore = any.simpleObject();
    const javascriptProjectType = 'JavaScript';
    const ci = any.word();
    inquirer.prompt.resolves({
      [questionNames.PROJECT_NAME]: projectName,
      [questionNames.PROJECT_TYPE]: javascriptProjectType,
      [questionNames.VISIBILITY]: visibility,
      [questionNames.REPO_HOST]: repoHost,
      [questionNames.GIT_REPO]: true,
      [questionNames.LICENSE]: license,
      [questionNames.CI]: ci
    });
    const jsConsumerBadges = any.simpleObject();
    const jsContibutionBadges = any.simpleObject();
    const verificationCommand = any.string();
    javascriptScaffolder.default
      .withArgs({projectName, projectRoot: projectPath, visibility, license, vcs, ci})
      .resolves({
        vcsIgnore: ignore,
        badges: {consumer: jsConsumerBadges, contribution: jsContibutionBadges},
        verificationCommand
      });
    vcsHostScaffolder.default
      .withArgs({host: repoHost, projectName, projectRoot: projectPath, projectType: javascriptProjectType})
      .resolves(vcs);

    return scaffolder().then(() => {
      assert.calledWith(gitScaffolder.default, {projectRoot: projectPath, ignore});
      assert.calledWith(
        readmeScaffolder.default,
        sinon.match({
          badges: {
            consumer: {...jsConsumerBadges, license: undefined},
            status: {ci: undefined},
            contribution: jsContibutionBadges
          }
        })
      );
      assert.calledWith(exec.default, verificationCommand, {silent: false});
    });
  });

  test('that running a verification command is not attempted when not provided', () => {
    inquirer.prompt.resolves({[questionNames.PROJECT_TYPE]: 'JavaScript'});
    javascriptScaffolder.default.resolves({badges: {}});

    return scaffolder().then(() => assert.notCalled(exec.default));
  });
});

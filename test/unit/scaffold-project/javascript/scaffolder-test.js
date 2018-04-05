import inquirer from 'inquirer';
import fs from 'mz/fs';
import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';
import {
  scopePromptShouldBePresented,
  shouldBeScopedPromptShouldBePresented
} from '../../../../src/scaffold-project/javascript/prompt-condiftionals';
import * as packageBuilder from '../../../../src/scaffold-project/javascript/package';
import * as installer from '../../../../src/scaffold-project/javascript/install';
import * as exec from '../../../../src/scaffold-project/shell/exec-as-promised';
import scaffoldJavaScript, {questionNames} from '../../../../src/scaffold-project/javascript/scaffolder';

suite('javascript project scaffolder', () => {
  let sandbox;
  const projectRoot = any.string();
  const projectName = any.string();
  const visibility = any.fromList(['Private', 'Public']);
  const nodeVersionCategoryChoices = ['LTS', 'Latest'];
  const ltsVersion = `v${any.integer()}.${any.integer()}.${any.integer()}`;
  const latestVersion = `v${any.integer()}.${any.integer()}.${any.integer()}`;

  setup(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(fs, 'writeFile');
    sandbox.stub(inquirer, 'prompt');
    sandbox.stub(packageBuilder, 'default');
    sandbox.stub(installer, 'default');
    sandbox.stub(exec, 'default');

    fs.writeFile.resolves();
    exec.default
      .withArgs('. ~/.nvm/nvm.sh && nvm ls-remote')
      .resolves([...any.listOf(any.word), latestVersion, ''].join('\n'));
    exec.default
      .withArgs('. ~/.nvm/nvm.sh && nvm ls-remote --lts')
      .resolves([...any.listOf(any.word), ltsVersion, ''].join('\n'));
  });

  teardown(() => sandbox.restore());

  test('that the user is prompted for the necessary details', () => {
    inquirer.prompt.resolves({
      [questionNames.NODE_VERSION_CATEGORY]: any.fromList(nodeVersionCategoryChoices)
    });

    return scaffoldJavaScript({visibility}).then(() => assert.calledWith(
      inquirer.prompt,
      [
        {
          name: questionNames.NODE_VERSION_CATEGORY,
          message: 'What node.js version should be used?',
          type: 'list',
          choices: nodeVersionCategoryChoices,
          default: 'Latest'
        },
        {
          name: questionNames.PACKAGE_TYPE,
          message: 'What type of JavaScript project is this?',
          type: 'list',
          choices: ['Application', 'Package'],
          default: 'Package'
        },
        {
          name: questionNames.SHOULD_BE_SCOPED,
          message: 'Should this package be scoped?',
          type: 'confirm',
          when: shouldBeScopedPromptShouldBePresented,
          default: true
        },
        {
          name: questionNames.SCOPE,
          message: 'What is the scope?',
          when: scopePromptShouldBePresented,
          default: 'travi'
        },
        {
          name: questionNames.UNIT_TESTS,
          message: 'Will this project be unit tested?',
          type: 'confirm',
          default: true
        },
        {
          name: questionNames.INTEGRATION_TESTS,
          message: 'Will this project be integration tested?',
          type: 'confirm',
          default: true
        }
      ]
    ));
  });

  suite('package', () => {
    test('that the package file is defined', () => {
      const packageDetails = any.simpleObject();
      const scope = any.word();
      const packageType = any.word();
      const license = any.string();
      const tests = {unit: any.boolean(), integration: any.boolean()};
      const vcs = any.simpleObject();
      inquirer.prompt.resolves({
        [questionNames.SCOPE]: scope,
        [questionNames.PACKAGE_TYPE]: packageType,
        [questionNames.UNIT_TESTS]: tests.unit,
        [questionNames.INTEGRATION_TESTS]: tests.integration,
        [questionNames.NODE_VERSION_CATEGORY]: any.fromList(nodeVersionCategoryChoices)
      });
      packageBuilder.default
        .withArgs({projectName, visibility, scope, packageType, license, tests, vcs})
        .returns(packageDetails);

      return scaffoldJavaScript({projectRoot, projectName, visibility, license, vcs}).then(() => assert.calledWith(
        fs.writeFile,
        `${projectRoot}/package.json`,
        JSON.stringify(packageDetails)
      ));
    });

    suite('dependencies', () => {
      suite('scripts', () => {
        test('that scripting tools are installed', async () => {
          inquirer.prompt.resolves({[questionNames.NODE_VERSION_CATEGORY]: any.word()});

          await scaffoldJavaScript({});

          assert.calledWith(installer.default, ['@travi/eslint-config-travi', 'npm-run-all']);
        });
      });

      suite('testing', () => {
        test('that mocha, chai, and sinon are installed when the project will be unit tested', async () => {
          inquirer.prompt.resolves({
            [questionNames.NODE_VERSION_CATEGORY]: any.fromList(nodeVersionCategoryChoices),
            [questionNames.UNIT_TESTS]: true
          });

          await scaffoldJavaScript({});

          assert.calledWith(installer.default, ['@travi/eslint-config-travi', 'npm-run-all', 'mocha', 'chai', 'sinon']);
        });

        test('that mocha, chai, and sinon are not installed when the project will not be unit tested', async () => {
          inquirer.prompt.resolves({
            [questionNames.NODE_VERSION_CATEGORY]: any.fromList(nodeVersionCategoryChoices),
            [questionNames.UNIT_TESTS]: false
          });

          await scaffoldJavaScript({});

          assert.calledWith(installer.default, ['@travi/eslint-config-travi', 'npm-run-all']);
        });

        test('that cucumber and chai are installed when the project will be integration tested', async () => {
          inquirer.prompt.resolves({
            [questionNames.NODE_VERSION_CATEGORY]: any.fromList(nodeVersionCategoryChoices),
            [questionNames.INTEGRATION_TESTS]: true
          });

          await scaffoldJavaScript({});

          assert.calledWith(installer.default, ['@travi/eslint-config-travi', 'npm-run-all', 'cucumber', 'chai']);
        });

        test('that cucumber and chai are not installed when the project will not be integration tested', async () => {
          inquirer.prompt.resolves({
            [questionNames.NODE_VERSION_CATEGORY]: any.fromList(nodeVersionCategoryChoices),
            [questionNames.INTEGRATION_TESTS]: false
          });

          await scaffoldJavaScript({});

          assert.calledWith(installer.default, ['@travi/eslint-config-travi', 'npm-run-all']);
        });

        test('that unique dependencies are requested when various reasons overlap', async () => {
          inquirer.prompt.resolves({
            [questionNames.NODE_VERSION_CATEGORY]: any.fromList(nodeVersionCategoryChoices),
            [questionNames.UNIT_TESTS]: true,
            [questionNames.INTEGRATION_TESTS]: true
          });

          await scaffoldJavaScript({});

          assert.calledWith(
            installer.default,
            ['@travi/eslint-config-travi', 'npm-run-all', 'mocha', 'chai', 'sinon', 'cucumber']
          );
        });
      });
    });
  });

  suite('save-exact', () => {
    test('that the project is configured to use exact dependency versions if it is an application', () => {
      inquirer.prompt.resolves({
        [questionNames.NODE_VERSION_CATEGORY]: any.fromList(nodeVersionCategoryChoices),
        [questionNames.PACKAGE_TYPE]: 'Application'
      });

      return scaffoldJavaScript({projectRoot, projectName, visibility: 'Public'}).then(() => {
        assert.calledWith(fs.writeFile, `${projectRoot}/.npmrc`, 'save-exact=true');
      });
    });

    test('that the project is allowed to use semver ranges if it is a package', () => {
      packageBuilder.default.returns({name: any.word()});
      inquirer.prompt.resolves({
        [questionNames.NODE_VERSION_CATEGORY]: any.fromList(nodeVersionCategoryChoices),
        [questionNames.PACKAGE_TYPE]: 'Package'
      });

      return scaffoldJavaScript({projectRoot, projectName, visibility: 'Public'}).then(() => {
        assert.neverCalledWith(fs.writeFile, `${projectRoot}/.npmrc`);
      });
    });
  });

  suite('nvm', () => {
    test('that the latest available version is used for the project when `Latest` is chosen', () => {
      inquirer.prompt.resolves({
        [questionNames.NODE_VERSION_CATEGORY]: 'Latest'
      });

      return scaffoldJavaScript({projectRoot, projectName, visibility: 'Public'}).then(() => {
        assert.calledWith(fs.writeFile, `${projectRoot}/.nvmrc`, latestVersion);
        assert.calledWith(exec.default, '. ~/.nvm/nvm.sh && nvm install', {silent: false});
      });
    });

    test('that the latest available version is used for the project when `LTS` is chosen', () => {
      inquirer.prompt.resolves({
        [questionNames.NODE_VERSION_CATEGORY]: 'LTS'
      });

      return scaffoldJavaScript({projectRoot, projectName, visibility: 'Public'}).then(() => {
        assert.calledWith(fs.writeFile, `${projectRoot}/.nvmrc`, ltsVersion);
        assert.calledWith(exec.default, '. ~/.nvm/nvm.sh && nvm install', {silent: false});
      });
    });
  });

  suite('data passed downstream', () => {
    suite('badges', () => {
      test('that the npm badge is defined for public packages', async () => {
        const packageName = any.word();
        packageBuilder.default.returns({name: packageName});
        inquirer.prompt.resolves({
          [questionNames.NODE_VERSION_CATEGORY]: any.word(),
          [questionNames.PACKAGE_TYPE]: 'Package'
        });

        const {badges} = await scaffoldJavaScript({projectRoot, projectName, visibility: 'Public'});

        assert.deepEqual(badges.consumer.npm, {
          img: `https://img.shields.io/npm/v/${packageName}.svg`,
          text: 'npm',
          link: `https://www.npmjs.com/package/${packageName}`
        });
      });

      test('that the npm badge is not defined for private packages', async () => {
        inquirer.prompt.resolves({
          [questionNames.NODE_VERSION_CATEGORY]: any.word(),
          [questionNames.PACKAGE_TYPE]: 'Package'
        });

        const {badges} = await scaffoldJavaScript({projectRoot, projectName, visibility: 'Private'});

        assert.isUndefined(badges.consumer.npm);
      });

      test('that the npm badge is not defined if the project is not a package', async () => {
        inquirer.prompt.resolves({
          [questionNames.NODE_VERSION_CATEGORY]: any.word(),
          [questionNames.PACKAGE_TYPE]: any.word()
        });

        const {badges} = await scaffoldJavaScript({projectRoot, projectName, visibility: 'Public'});

        assert.isUndefined(badges.consumer.npm);
      });
    });

    suite('vcs ignore', () => {
      test('that files and directories are defined to be ignored from version control', async () => {
        inquirer.prompt.resolves({[questionNames.NODE_VERSION_CATEGORY]: any.word()});

        const {vcsIgnore} = await scaffoldJavaScript({projectRoot, projectName, visibility: 'Public'});

        assert.include(vcsIgnore.files, '.eslintcache');

        assert.include(vcsIgnore.directories, '/node_modules/');
        assert.include(vcsIgnore.directories, '/lib/');
      });
    });

    suite('verification', () => {
      test('that `npm test` is defined as the verification command', async () => {
        inquirer.prompt.resolves({[questionNames.NODE_VERSION_CATEGORY]: any.word()});

        const {verificationCommand} = await scaffoldJavaScript({projectRoot, projectName, visibility: any.word()});

        assert.equal(verificationCommand, 'npm test');
      });
    });
  });
});

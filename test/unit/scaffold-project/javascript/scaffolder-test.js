import inquirer from 'inquirer';
import fs from 'mz/fs';
import shell from 'shelljs';
import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';
import {
  scopePromptShouldBePresented,
  shouldBeScopedPromptShouldBePresented
} from '../../../../src/scaffold-project/javascript/prompt-condiftionals';
import * as packageBuilder from '../../../../src/scaffold-project/javascript/package';
import * as installer from '../../../../src/scaffold-project/javascript/install';
import scaffoldJavaScript, {questionNames} from '../../../../src/scaffold-project/javascript/scaffolder';

suite('javascript project scaffolder', () => {
  let sandbox;
  const projectRoot = any.string();
  const projectName = any.string();
  const visibility = any.fromList(['Private', 'Public']);

  setup(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(fs, 'writeFile');
    sandbox.stub(inquirer, 'prompt');
    sandbox.stub(packageBuilder, 'default');
    sandbox.stub(installer, 'default');
    sandbox.stub(shell, 'exec');

    fs.writeFile.resolves();
    shell.exec.yields(0);
  });

  teardown(() => sandbox.restore());

  test('that the user is prompted for the necessary details', () => {
    inquirer.prompt.resolves({});

    return scaffoldJavaScript({visibility}).then(() => assert.calledWith(
      inquirer.prompt,
      [
        {
          name: questionNames.NODE_VERSION_CATEGORY,
          message: 'What node.js version should be used?',
          type: 'list',
          choices: ['LTS', 'Latest'],
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
      inquirer.prompt.resolves({
        [questionNames.SCOPE]: scope,
        [questionNames.PACKAGE_TYPE]: packageType,
        [questionNames.UNIT_TESTS]: tests.unit,
        [questionNames.INTEGRATION_TESTS]: tests.integration
      });
      packageBuilder.default
        .withArgs({projectName, visibility, scope, packageType, license, tests})
        .returns(packageDetails);

      return scaffoldJavaScript({projectRoot, projectName, visibility, license}).then(() => assert.calledWith(
        fs.writeFile,
        `${projectRoot}/package.json`,
        JSON.stringify(packageDetails)
      ));
    });

    suite('dependencies', () => {
      suite('testing', () => {
        test('that mocha and chai are installed when the project will be unit tested', async () => {
          inquirer.prompt.resolves({
            [questionNames.UNIT_TESTS]: true
          });

          await scaffoldJavaScript({});

          assert.calledWith(installer.default, ['mocha', 'chai']);
        });

        test('that mocha and chai are not installed when the project will not be unit tested', async () => {
          inquirer.prompt.resolves({
            [questionNames.UNIT_TESTS]: false
          });

          await scaffoldJavaScript({});

          assert.calledWith(installer.default, []);
        });
      });
    });
  });

  suite('save-exact', () => {
    test('that the project is configured to use exact dependency versions if it is an application', () => {
      inquirer.prompt.resolves({[questionNames.PACKAGE_TYPE]: 'Application'});

      return scaffoldJavaScript({projectRoot, projectName, visibility: 'Public'}).then(() => {
        assert.calledWith(fs.writeFile, `${projectRoot}/.npmrc`, 'save-exact=true');
      });
    });

    test('that the project is allowed to use semver ranges if it is a package', () => {
      inquirer.prompt.resolves({[questionNames.PACKAGE_TYPE]: 'Package'});

      return scaffoldJavaScript({projectRoot, projectName, visibility: 'Public'}).then(() => {
        assert.neverCalledWith(fs.writeFile, `${projectRoot}/.npmrc`);
      });
    });
  });
});

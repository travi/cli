import inquirer from 'inquirer';
import fs from 'mz/fs';
import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';
import scaffoldJavaScript, {questionNames} from '../../../../src/scaffold-project/javascript/scaffolder';
import {
  scopePromptShouldBePresented,
  shouldBeScopedPromptShouldBePresented
} from '../../../../src/scaffold-project/javascript/prompt-condiftionals';

suite('javascript project scaffolder', () => {
  let sandbox;
  const projectRoot = any.string();
  const projectName = any.string();
  const visibility = any.fromList(['Private', 'Public']);

  setup(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(fs, 'writeFile');
    sandbox.stub(inquirer, 'prompt');

    fs.writeFile.resolves();
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
        }
      ]
    ));
  });

  test('that javascript project files are generated', () => {
    inquirer.prompt.resolves({});

    return scaffoldJavaScript({projectRoot, projectName, visibility}).then(() => {
      assert.calledWith(fs.writeFile, `${projectRoot}/package.json`, JSON.stringify({
        name: projectName
      }));
    });
  });

  test('that the scope is included in the project name when provided', () => {
    const scope = any.word();
    inquirer.prompt.resolves({[questionNames.SCOPE]: scope});

    return scaffoldJavaScript({projectRoot, projectName, visibility}).then(() => {
      assert.calledWith(fs.writeFile, `${projectRoot}/package.json`, JSON.stringify({
        name: `@${scope}/${projectName}`
      }));
    });
  });

  test('that the package is marked as private for an application', () => {
    inquirer.prompt.resolves({[questionNames.PACKAGE_TYPE]: 'Application'});

    return scaffoldJavaScript({projectRoot, projectName, visibility}).then(() => {
      assert.calledWith(fs.writeFile, `${projectRoot}/package.json`, JSON.stringify({
        name: projectName,
        private: true
      }));
    });
  });

  suite('publish config', () => {
    test('that access is marked as restricted for private projects', () => {
      inquirer.prompt.resolves({[questionNames.PACKAGE_TYPE]: 'Package'});

      return scaffoldJavaScript({projectRoot, projectName, visibility: 'Private'}).then(() => {
        assert.calledWith(fs.writeFile, `${projectRoot}/package.json`, JSON.stringify({
          name: projectName,
          version: '0.0.0-semantically-released',
          publishConfig: {access: 'restricted'}
        }));
      });
    });

    test('that access is marked as public for public projects', () => {
      inquirer.prompt.resolves({[questionNames.PACKAGE_TYPE]: 'Package'});

      return scaffoldJavaScript({projectRoot, projectName, visibility: 'Public'}).then(() => {
        assert.calledWith(fs.writeFile, `${projectRoot}/package.json`, JSON.stringify({
          name: projectName,
          version: '0.0.0-semantically-released',
          publishConfig: {access: 'public'}
        }));
      });
    });
  });
});

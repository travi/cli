import inquirer from 'inquirer';
import fs from 'mz/fs';
import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';
import scaffoldJavaScript, {questionNames} from '../../../src/scaffold-project/javascript';

suite('javascript project scaffolder', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(fs, 'writeFile');
    sandbox.stub(inquirer, 'prompt');

    fs.writeFile.resolves();
  });

  teardown(() => sandbox.restore());

  test('that the user is prompted for the necessary details', () => {
    inquirer.prompt.resolves({});

    return scaffoldJavaScript({}).then(() => assert.calledWith(
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
        }
      ]
    ));
  });

  test('that javascript project files are generated', () => {
    const projectRoot = any.string();
    const projectName = any.string();

    return scaffoldJavaScript({projectRoot, projectName}).then(() => {
      assert.calledWith(fs.writeFile, `${projectRoot}/package.json`, JSON.stringify({
        name: projectName
      }));
    });
  });

  test('that the scope is included in the project name when provided', () => {
    const projectRoot = any.string();
    const projectName = any.string();
    const scope = any.word();

    return scaffoldJavaScript({projectRoot, projectName, scope}).then(() => {
      assert.calledWith(fs.writeFile, `${projectRoot}/package.json`, JSON.stringify({
        name: `@${scope}/${projectName}`
      }));
    });
  });
});

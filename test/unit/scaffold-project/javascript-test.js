import fs from 'mz/fs';
import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';
import scaffoldJavaScript from '../../../src/scaffold-project/javascript';

suite('javascript project scaffolder', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(fs, 'writeFile');

    fs.writeFile.resolves();
  });

  teardown(() => sandbox.restore());

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

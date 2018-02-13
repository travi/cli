import fs from 'mz/fs';
import any from '@travi/any';
import sinon from 'sinon';
import {assert} from 'chai';
import scaffoldReadme from '../../../src/scaffold-project/readme';

suite('scaffold readme', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(fs, 'writeFile');
  });

  teardown(() => sandbox.restore());

  test('that the README has a top-level heading of the project name', () => {
    const projectName = any.string();
    const projectRoot = any.string();
    fs.writeFile.resolves();

    return scaffoldReadme({projectName, projectRoot}).then(() => assert.calledWith(
      fs.writeFile,
      `${projectRoot}/README.md`,
      `# ${projectName}\n`
    ));
  });
});

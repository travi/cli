import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import * as yamlWriter from '../../../../third-party-wrappers/write-yaml';
import scaffoldGithub from '../../../../src/scaffold-project/vcs/github';

suite('github', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(yamlWriter, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the settings file is produced', () => {
    const projectRoot = any.string();
    yamlWriter.default.resolves();

    return scaffoldGithub(projectRoot).then(() => assert.calledWith(
      yamlWriter.default,
      `${projectRoot}/.github/settings.yml`,
      {
        repository: {
          has_wiki: false,
          has_projects: false,
          has_downloads: false,
          allow_squash_merge: false,
          allow_merge_commit: true,
          allow_rebase_merge: true
        }
      }
    ));
  });
});

import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import * as yamlWriter from '../../../../third-party-wrappers/write-yaml';
import scaffoldGithub from '../../../../src/scaffold-project/vcs/github';

suite('github', () => {
  let sandbox;
  const projectRoot = any.string();

  setup(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(yamlWriter, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the settings file is produced', () => {
    yamlWriter.default.resolves();

    return scaffoldGithub({projectRoot}).then(() => assert.calledWith(
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

  test('that the greenkeeper label is defined for javascript projects', () => {
    yamlWriter.default.resolves();

    return scaffoldGithub({projectRoot, projectType: 'JavaScript'}).then(() => assert.calledWith(
      yamlWriter.default,
      `${projectRoot}/.github/settings.yml`,
      sinon.match({labels: [{name: 'greenkeeper', color: '00c775'}]})
    ));
  });
});

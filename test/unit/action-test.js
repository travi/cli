import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import * as projectScaffolder from '@travi/project-scaffolder';
import {prompt as githubPrompt, scaffold as scaffoldGithub} from '@travi/github-scaffolder';
import {scaffold as scaffoldGitlab} from '@travi/gitlab-scaffolder';
import {scaffold as scaffoldRuby} from '@form8ion/ruby-scaffolder';
import * as enhancedScaffolders from '../../src/enhanced-scaffolders';
import getAction from '../../src/action';

suite('action', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(projectScaffolder, 'scaffold');
    sandbox.stub(console, 'error');
    sandbox.stub(enhancedScaffolders, 'javascriptScaffolderFactory');
  });

  teardown(() => {
    process.exitCode = 0;
    sandbox.restore();
  });

  test('that language and vcs-host scaffolders are provided to the project scaffolder', async () => {
    const javascriptScaffolder = () => undefined;
    const decisions = any.simpleObject();
    enhancedScaffolders.javascriptScaffolderFactory.withArgs(decisions).returns(javascriptScaffolder);

    projectScaffolder.scaffold.resolves();

    await getAction(decisions)();

    assert.calledWith(
      projectScaffolder.scaffold,
      {
        languages: {JavaScript: javascriptScaffolder, Ruby: scaffoldRuby, Shell: enhancedScaffolders.shell},
        vcsHosts: {
          GitHub: {scaffolder: scaffoldGithub, prompt: githubPrompt, public: true, private: true},
          GitLab: {scaffolder: scaffoldGitlab, prompt: enhancedScaffolders.gitlabPrompt, private: true}
        },
        overrides: {copyrightHolder: 'Matt Travi'},
        decisions
      }
    );
  });

  test('that the exit-code is set to `1` upon failure when a code is not provided', async () => {
    const error = new Error();
    projectScaffolder.scaffold.rejects(error);

    await getAction()();

    assert.equal(process.exitCode, 1);
    assert.calledWith(console.error, error);      // eslint-disable-line no-console
  });

  test('that the exit-code is set to the provided code upon failure when provided', async () => {
    const code = any.integer();
    const error = new Error();
    error.data = {code};
    projectScaffolder.scaffold.rejects(error);

    await getAction()();

    assert.equal(process.exitCode, code);
  });
});

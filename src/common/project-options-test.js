import {scaffold as scaffoldRuby} from '@form8ion/ruby-scaffolder';
import {prompt as githubPrompt, scaffold as scaffoldGithub} from '@travi/github-scaffolder';
import {scaffold as scaffoldGitlab} from '@travi/gitlab-scaffolder';
import {scaffold as scaffoldDependabot} from '@form8ion/dependabot-scaffolder';
import {scaffold as scaffoldRenovate} from '@form8ion/renovate-scaffolder';
import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import * as enhancedScaffolders from './enhanced-scaffolders';
import {defineScaffoldProjectOptions} from './project-options';

suite('common config', () => {
  let sandbox;
  const decisions = any.simpleObject();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(enhancedScaffolders, 'javascriptScaffolderFactory');
  });

  teardown(() => sandbox.restore());

  test('that scaffold-project options are defined', () => {
    const jsScaffolder = () => undefined;
    enhancedScaffolders.javascriptScaffolderFactory.withArgs(decisions).returns(jsScaffolder);

    assert.deepEqual(
      defineScaffoldProjectOptions(decisions),
      {
        languages: {JavaScript: jsScaffolder, Ruby: scaffoldRuby, Shell: enhancedScaffolders.shell},
        vcsHosts: {
          GitHub: {scaffolder: scaffoldGithub, prompt: githubPrompt, public: true, private: true},
          GitLab: {scaffolder: scaffoldGitlab, prompt: enhancedScaffolders.gitlabPrompt, private: true}
        },
        dependencyUpdaters: {
          Dependabot: {scaffolder: scaffoldDependabot},
          Renovate: {scaffolder: scaffoldRenovate}
        },
        overrides: {copyrightHolder: 'Matt Travi'},
        decisions
      }
    );
  });
});

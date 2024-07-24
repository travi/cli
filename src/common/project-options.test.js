import * as rubyPlugin from '@form8ion/ruby-scaffolder';
import {prompt as githubPrompt, scaffold as scaffoldGithub} from '@travi/github-scaffolder';
import {scaffold as scaffoldGitlab} from '@travi/gitlab-scaffolder';
import * as dependabotPlugin from '@form8ion/dependabot-scaffolder';
import * as renovatePlugin from '@form8ion/renovate-scaffolder';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {javascriptPluginFactory, shellPluginFactory} from './enhanced-plugins.js';
import * as enhancedScaffolders from './enhanced-scaffolders.js';
import {defineScaffoldProjectOptions} from './project-options.js';

vi.mock('./enhanced-plugins.js');

describe('common config', () => {
  const decisions = any.simpleObject();

  it('should define scaffold-project options', () => {
    const jsPlugin = any.simpleObject();
    const shellPlugin = any.simpleObject();
    when(javascriptPluginFactory).calledWith(decisions).mockReturnValue(jsPlugin);
    shellPluginFactory.mockReturnValue(shellPlugin);

    expect(defineScaffoldProjectOptions(decisions)).toEqual({
      vcsHosts: {
        GitHub: {scaffolder: scaffoldGithub, prompt: githubPrompt, public: true, private: true},
        GitLab: {scaffolder: scaffoldGitlab, prompt: enhancedScaffolders.gitlabPrompt, private: true}
      },
      plugins: {
        dependencyUpdaters: {
          Dependabot: dependabotPlugin,
          Renovate: renovatePlugin
        },
        languages: {JavaScript: jsPlugin, Ruby: rubyPlugin, Shell: shellPlugin}
      },
      decisions
    });
  });
});

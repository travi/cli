import * as rubyPlugin from '@form8ion/ruby-scaffolder';
import * as githubPlugin from '@form8ion/github';
import * as gitlabPrompt from '@travi/gitlab-scaffolder';
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
      plugins: {
        dependencyUpdaters: {
          Dependabot: dependabotPlugin,
          Renovate: renovatePlugin
        },
        languages: {JavaScript: jsPlugin, Ruby: rubyPlugin, Shell: shellPlugin},
        vcsHosts: {
          GitHub: {...githubPlugin, public: true, private: true},
          GitLab: {...gitlabPrompt, prompt: enhancedScaffolders.gitlabPrompt, private: true}
        }
      },
      decisions
    });
  });
});

import * as rubyPlugin from '@form8ion/ruby-scaffolder';
import * as githubPlugin from '@travi/github-scaffolder';
import {prompt as githubPrompt} from '@travi/github-scaffolder';
import * as gitlabPlugin from '@travi/gitlab-scaffolder';
import * as dependabotPlugin from '@form8ion/dependabot-scaffolder';
import * as renovatePlugin from '@form8ion/renovate-scaffolder';

import {gitlabPrompt} from './enhanced-scaffolders.js';
import {javascriptPluginFactory, shellPluginFactory} from './enhanced-plugins.js';

export function defineScaffoldProjectOptions(decisions) {
  return {
    plugins: {
      dependencyUpdaters: {
        Dependabot: dependabotPlugin,
        Renovate: renovatePlugin
      },
      languages: {JavaScript: javascriptPluginFactory(decisions), Ruby: rubyPlugin, Shell: shellPluginFactory()},
      vcsHosts: {
        GitHub: {...githubPlugin, prompt: githubPrompt, public: true, private: true},
        GitLab: {...gitlabPlugin, prompt: gitlabPrompt, private: true}
      }
    },
    decisions
  };
}

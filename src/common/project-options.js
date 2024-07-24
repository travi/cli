import * as rubyPlugin from '@form8ion/ruby-scaffolder';
import {prompt as githubPrompt, scaffold as scaffoldGithub} from '@travi/github-scaffolder';
import {scaffold as scaffoldGitlab} from '@travi/gitlab-scaffolder';
import * as dependabotPlugin from '@form8ion/dependabot-scaffolder';
import * as renovatePlugin from '@form8ion/renovate-scaffolder';

import {gitlabPrompt} from './enhanced-scaffolders.js';
import {javascriptPluginFactory, shellPluginFactory} from './enhanced-plugins.js';

export function defineScaffoldProjectOptions(decisions) {
  return {
    vcsHosts: {
      GitHub: {scaffolder: scaffoldGithub, prompt: githubPrompt, public: true, private: true},
      GitLab: {scaffolder: scaffoldGitlab, prompt: gitlabPrompt, private: true}
    },
    plugins: {
      dependencyUpdaters: {
        Dependabot: dependabotPlugin,
        Renovate: renovatePlugin
      },
      languages: {JavaScript: javascriptPluginFactory(decisions), Ruby: rubyPlugin, Shell: shellPluginFactory()}
    },
    decisions
  };
}

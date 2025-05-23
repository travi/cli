import {composeDependenciesInto} from '@form8ion/core';
import {logger} from '@form8ion/cli-core';
import {octokit} from '@form8ion/github-core';
import * as dependabotPlugin from '@form8ion/dependabot-scaffolder';
import * as renovatePlugin from '@form8ion/renovate-scaffolder';
import * as rubyPlugin from '@form8ion/ruby-scaffolder';
import * as phpPlugin from '@form8ion/php';
import * as githubPlugin from '@form8ion/github';
import * as gitlabPlugin from '@travi/gitlab-scaffolder';

import {getGithubPrompt} from './prompts.js';
import {javascriptPluginFactory, shellPluginFactory} from './enhanced-plugins.js';

export function project(decisions) {
  const octokitInstance = octokit.getNetrcAuthenticatedInstance();
  const githubPluginDependencies = {logger, prompt: getGithubPrompt(decisions), octokit: octokitInstance};

  return {
    dependencyUpdaters: {
      Dependabot: dependabotPlugin,
      Renovate: renovatePlugin
    },
    languages: {
      JavaScript: javascriptPluginFactory(decisions),
      Ruby: rubyPlugin,
      Shell: shellPluginFactory(),
      PHP: phpPlugin
    },
    vcsHosts: {
      GitHub: {
        ...githubPlugin,
        scaffold: composeDependenciesInto(githubPlugin.scaffold, githubPluginDependencies),
        lift: composeDependenciesInto(githubPlugin.lift, githubPluginDependencies)
      },
      GitLab: gitlabPlugin
    }
  };
}

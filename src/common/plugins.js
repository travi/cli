import * as dependabotPlugin from '@form8ion/dependabot-scaffolder';
import * as renovatePlugin from '@form8ion/renovate-scaffolder';
import * as rubyPlugin from '@form8ion/ruby-scaffolder';
import * as githubPlugin from '@form8ion/github';
import * as gitlabPlugin from '@travi/gitlab-scaffolder';

import {javascriptPluginFactory, shellPluginFactory} from './enhanced-plugins.js';

export function project(decisions) {
  return {
    dependencyUpdaters: {
      Dependabot: dependabotPlugin,
      Renovate: renovatePlugin
    },
    languages: {JavaScript: javascriptPluginFactory(decisions), Ruby: rubyPlugin, Shell: shellPluginFactory()},
    vcsHosts: {
      GitHub: githubPlugin,
      GitLab: gitlabPlugin
    }
  };
}

import {scaffold as scaffoldRuby} from '@form8ion/ruby-scaffolder';
import {prompt as githubPrompt, scaffold as scaffoldGithub} from '@travi/github-scaffolder';
import {scaffold as scaffoldGitlab} from '@travi/gitlab-scaffolder';
import {scaffold as scaffoldDependabot} from '@form8ion/dependabot-scaffolder';
import {scaffold as scaffoldRenovate} from '@form8ion/renovate-scaffolder';
import {gitlabPrompt, javascriptScaffolderFactory, shell} from '../scaffolder/enhanced-scaffolders';

const traviName = 'Matt Travi';

export function defineScaffoldOptions(decisions) {
  return {
    languages: {JavaScript: javascriptScaffolderFactory(decisions), Ruby: scaffoldRuby, Shell: shell},
    vcsHosts: {
      GitHub: {scaffolder: scaffoldGithub, prompt: githubPrompt, public: true, private: true},
      GitLab: {scaffolder: scaffoldGitlab, prompt: gitlabPrompt, private: true}
    },
    overrides: {copyrightHolder: traviName},
    dependencyUpdaters: {
      Dependabot: {scaffolder: scaffoldDependabot},
      Renovate: {scaffolder: scaffoldRenovate}
    },
    decisions
  };
}

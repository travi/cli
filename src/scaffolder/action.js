import {scaffold as scaffoldProject} from '@travi/project-scaffolder';
import {prompt as githubPrompt, scaffold as scaffoldGithub} from '@travi/github-scaffolder';
import {scaffold as scaffoldGitlab} from '@travi/gitlab-scaffolder';
import {scaffold as scaffoldRuby} from '@form8ion/ruby-scaffolder';
import {scaffold as scaffoldDependabot} from '@form8ion/dependabot-scaffolder';
import {scaffold as scaffoldRenovate} from '@form8ion/renovate-scaffolder';
import {gitlabPrompt, javascriptScaffolderFactory, shell} from './enhanced-scaffolders';

export default function (decisions) {
  return () => scaffoldProject({
    languages: {JavaScript: javascriptScaffolderFactory(decisions), Ruby: scaffoldRuby, Shell: shell},
    vcsHosts: {
      GitHub: {scaffolder: scaffoldGithub, prompt: githubPrompt, public: true, private: true},
      GitLab: {scaffolder: scaffoldGitlab, prompt: gitlabPrompt, private: true}
    },
    dependencyUpdaters: {
      Dependabot: {scaffolder: scaffoldDependabot},
      Renovate: {scaffolder: scaffoldRenovate}
    },
    overrides: {copyrightHolder: 'Matt Travi'},
    decisions
  }).catch(err => {
    console.error(err);     // eslint-disable-line no-console
    process.exitCode = (err.data && err.data.code) || 1;
  });
}

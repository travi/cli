import {scaffold as scaffoldProject} from '@travi/project-scaffolder';
import {prompt as githubPrompt, scaffold as scaffoldGithub} from '@travi/github-scaffolder';
import {scaffold as scaffoldGitlab} from '@travi/gitlab-scaffolder';
import {scaffold as scaffoldRuby} from '@form8ion/ruby-scaffolder';
import {gitlabPrompt, javascript, shell} from './enhanced-scaffolders';

export default function () {
  return scaffoldProject({
    languages: {JavaScript: javascript, Ruby: scaffoldRuby, Shell: shell},
    vcsHosts: {
      GitHub: {scaffolder: scaffoldGithub, prompt: githubPrompt, public: true, private: true},
      GitLab: {scaffolder: scaffoldGitlab, prompt: gitlabPrompt, private: true}
    },
    overrides: {copyrightHolder: 'Matt Travi'}
  }).catch(err => {
    console.error(err);     // eslint-disable-line no-console
    process.exitCode = (err.data && err.data.code) || 1;
  });
}

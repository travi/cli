import {scaffold as scaffoldProject} from '@travi/project-scaffolder';
import {prompt as githubPrompt, scaffold as scaffoldGithub} from '@travi/github-scaffolder';
import {scaffold as scaffoldGitlab} from '@travi/gitlab-scaffolder';
import {scaffold as scaffoldShell} from '@travi/shell-scaffolder';
import {gitlabPrompt, javascript} from './enhanced-scaffolders';

export default function () {
  return scaffoldProject({
    languages: {JavaScript: javascript, Shell: scaffoldShell},
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

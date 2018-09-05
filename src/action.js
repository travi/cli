import {scaffold as scaffoldProject} from '@travi/project-scaffolder';
import {scaffold as scaffoldGithub, prompt} from '@travi/github-scaffolder';
import {javascript} from './enhanced-scaffolders';

export default function () {
  return scaffoldProject({
    languages: {JavaScript: javascript},
    vcsHosts: {GitHub: {scaffolder: scaffoldGithub, prompt, public: true}},
    overrides: {copyrightHolder: 'Matt Travi'}
  }).catch(err => {
    console.error(err);     // eslint-disable-line no-console
    process.exitCode = (err.data && err.data.code) || 1;
  });
}

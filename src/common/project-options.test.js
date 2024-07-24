import {scaffold as scaffoldRuby} from '@form8ion/ruby-scaffolder';
import {prompt as githubPrompt, scaffold as scaffoldGithub} from '@travi/github-scaffolder';
import {scaffold as scaffoldGitlab} from '@travi/gitlab-scaffolder';
import * as dependabotPlugin from '@form8ion/dependabot-scaffolder';
import * as renovatePlugin from '@form8ion/renovate-scaffolder';

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {defineScaffoldProjectOptions} from './project-options.js';
import * as enhancedScaffolders from './enhanced-scaffolders.js';

describe('common config', () => {
  const decisions = any.simpleObject();

  beforeEach(() => {
    vi.mock('./enhanced-scaffolders');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should define scaffold-project options', () => {
    const jsScaffolder = () => undefined;
    when(enhancedScaffolders.javascriptScaffolderFactory).calledWith(decisions).mockReturnValue(jsScaffolder);

    expect(defineScaffoldProjectOptions(decisions)).toEqual({
      languages: {JavaScript: jsScaffolder, Ruby: scaffoldRuby, Shell: enhancedScaffolders.shell},
      vcsHosts: {
        GitHub: {scaffolder: scaffoldGithub, prompt: githubPrompt, public: true, private: true},
        GitLab: {scaffolder: scaffoldGitlab, prompt: enhancedScaffolders.gitlabPrompt, private: true}
      },
      plugins: {
        dependencyUpdaters: {
          Dependabot: dependabotPlugin,
          Renovate: renovatePlugin
        }
      },
      decisions
    });
  });
});

import {composeDependenciesInto} from '@form8ion/core';
import {logger} from '@form8ion/cli-core';
import {octokit} from '@form8ion/github-core';
import * as dependabotPlugin from '@form8ion/dependabot-scaffolder';
import * as renovatePlugin from '@form8ion/renovate-scaffolder';
import * as rubyPlugin from '@form8ion/ruby-scaffolder';
import * as phpPlugin from '@form8ion/php';
import * as githubPlugin from '@form8ion/github';
import * as gitlabPlugin from '@travi/gitlab-scaffolder';

import any from '@travi/any';
import {describe, expect, it, vi} from 'vitest';
import {when} from 'jest-when';

import {getGithubPrompt} from './prompts.js';
import {javascriptPluginFactory, shellPluginFactory} from './enhanced-plugins.js';
import {project} from './plugins.js';

vi.mock('@form8ion/core');
vi.mock('@form8ion/github-core');
vi.mock('./prompts.js');
vi.mock('./enhanced-plugins.js');

describe('plugins', () => {
  const decisions = any.simpleObject();

  it('defines the project plugins', () => {
    const jsPlugin = any.simpleObject();
    const shellPlugin = any.simpleObject();
    const octokitInstance = any.simpleObject();
    const githubPrompt = () => undefined;
    const githubPluginDependencies = {logger, prompt: githubPrompt, octokit: octokitInstance};
    const enhancedGithubScaffolder = any.simpleObject();
    const enhancedGithubLifter = any.simpleObject();
    when(javascriptPluginFactory).calledWith(decisions).mockReturnValue(jsPlugin);
    shellPluginFactory.mockReturnValue(shellPlugin);
    when(getGithubPrompt).calledWith(decisions).mockReturnValue(githubPrompt);
    when(octokit.getNetrcAuthenticatedInstance).calledWith().mockReturnValue(octokitInstance);
    when(composeDependenciesInto)
      .calledWith(githubPlugin.scaffold, githubPluginDependencies)
      .mockReturnValue(enhancedGithubScaffolder);
    when(composeDependenciesInto)
      .calledWith(githubPlugin.lift, githubPluginDependencies)
      .mockReturnValue(enhancedGithubLifter);

    expect(project(decisions)).toEqual({
      dependencyUpdaters: {
        Dependabot: dependabotPlugin,
        Renovate: renovatePlugin
      },
      languages: {
        JavaScript: jsPlugin,
        Ruby: rubyPlugin,
        Shell: shellPlugin,
        PHP: phpPlugin
      },
      vcsHosts: {
        GitHub: {...githubPlugin, scaffold: enhancedGithubScaffolder, lift: enhancedGithubLifter},
        GitLab: gitlabPlugin
      }
    });
  });
});

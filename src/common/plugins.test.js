import * as dependabotPlugin from '@form8ion/dependabot-scaffolder';
import * as renovatePlugin from '@form8ion/renovate-scaffolder';
import * as rubyPlugin from '@form8ion/ruby-scaffolder';
import * as phpPlugin from '@form8ion/php';
import * as githubPlugin from '@form8ion/github';
import * as gitlabPlugin from '@travi/gitlab-scaffolder';

import any from '@travi/any';
import {describe, expect, it, vi} from 'vitest';
import {when} from 'jest-when';

import {javascriptPluginFactory, shellPluginFactory} from './enhanced-plugins.js';
import {project} from './plugins.js';

vi.mock('./enhanced-plugins.js');

describe('plugins', () => {
  const decisions = any.simpleObject();

  it('defines the project plugins', () => {
    const jsPlugin = any.simpleObject();
    const shellPlugin = any.simpleObject();
    when(javascriptPluginFactory).calledWith(decisions).mockReturnValue(jsPlugin);
    shellPluginFactory.mockReturnValue(shellPlugin);

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
        GitHub: githubPlugin,
        GitLab: gitlabPlugin
      }
    });
  });
});

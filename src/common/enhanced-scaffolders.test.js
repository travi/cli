import * as javascriptPlugin from '@form8ion/javascript';
import shellScaffolder from '@travi/shell-scaffolder';
import gitlabScaffolder from '@travi/gitlab-scaffolder';
import {scaffold as scaffoldTravisForShell} from '@travi/travis-scaffolder-shell';

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import * as commonJavascriptOptions from './javascript-options';
import {gitlabPrompt, javascriptScaffolderFactory, shell} from './enhanced-scaffolders';

describe('scaffolder factories', () => {
  const options = any.simpleObject();
  const output = any.simpleObject();

  beforeEach(() => {
    vi.mock('@form8ion/javascript');
    vi.mock('@travi/shell-scaffolder');
    vi.mock('@travi/gitlab-scaffolder');
    vi.mock('./javascript-options');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should pass the custom properties along with the provided options to the js scaffolder', async () => {
    const decisions = any.simpleObject();
    const scaffoldJavascriptOptions = any.simpleObject();
    when(commonJavascriptOptions.defineScaffoldJavascriptOptions)
      .calledWith(decisions, options)
      .mockReturnValue(scaffoldJavascriptOptions);
    when(javascriptPlugin.scaffold).calledWith(scaffoldJavascriptOptions).mockResolvedValue(output);

    expect(await javascriptScaffolderFactory(decisions)(options)).toBe(output);
  });

  it('should pass the custom properties along with the provided options to the shell scaffolder', async () => {
    when(shellScaffolder.scaffold)
      .calledWith({...options, ciServices: {Travis: {scaffolder: scaffoldTravisForShell, public: true}}})
      .mockResolvedValue(output);

    expect(await shell(options)).toBe(output);
  });

  it('should pass the owner account to the github prompts', async () => {
    when(gitlabScaffolder.prompt).calledWith({account: 'travi'}).mockResolvedValue(output);

    expect(await gitlabPrompt()).toBe(output);
  });
});

import * as javascriptPlugin from '@form8ion/javascript';
import * as shellScaffolder from '@travi/shell-scaffolder';
import {scaffold as scaffoldTravisForShell} from '@travi/travis-scaffolder-shell';

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import * as commonJavascriptOptions from './javascript-options.js';
import {javascriptScaffolderFactory, shell} from './enhanced-scaffolders.js';

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
      .thenReturn(scaffoldJavascriptOptions);
    when(javascriptPlugin.scaffold).calledWith(scaffoldJavascriptOptions).thenResolve(output);

    expect(await javascriptScaffolderFactory(decisions)(options)).toBe(output);
  });

  it('should pass the custom properties along with the provided options to the shell scaffolder', async () => {
    when(shellScaffolder.scaffold)
      .calledWith({...options, ciServices: {Travis: {scaffolder: scaffoldTravisForShell, public: true}}})
      .thenResolve(output);

    expect(await shell(options)).toBe(output);
  });
});

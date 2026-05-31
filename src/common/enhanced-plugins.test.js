import * as javascriptPlugin from '@form8ion/javascript';
import * as shellPlugin from '@travi/shell-scaffolder';

import any from '@travi/any';
import {when} from 'vitest-when';
import {describe, vi, it, expect} from 'vitest';

import {javascriptScaffolderFactory, shell} from './enhanced-scaffolders.js';
import {javascriptLifterFactory, javascriptTesterFactory} from './enhanced-lifters.js';
import {javascriptPluginFactory, shellPluginFactory} from './enhanced-plugins.js';

vi.mock('./enhanced-scaffolders.js');
vi.mock('./enhanced-lifters.js');

describe('enhanced plugins', () => {
  it('should pass the custom properties along with the provided options to the js plugin', async () => {
    const decisions = any.simpleObject();
    const enhancedScaffolder = () => undefined;
    const enhancedLifter = () => undefined;
    const enhancedTester = () => undefined;
    const dependencies = any.simpleObject();
    when(javascriptScaffolderFactory).calledWith(decisions, dependencies).thenReturn(enhancedScaffolder);
    when(javascriptLifterFactory).calledWith(dependencies).thenReturn(enhancedLifter);
    when(javascriptTesterFactory).calledWith(dependencies).thenReturn(enhancedTester);

    expect(await javascriptPluginFactory(decisions, dependencies))
      // eslint-disable-next-line prefer-object-spread
      .toEqual(Object.assign(
        {},
        javascriptPlugin,
        {scaffold: enhancedScaffolder, lift: enhancedLifter, test: enhancedTester}
      ));
  });

  it('should pass the custom properties along with the provided options to the shell scaffolder', async () => {
    // eslint-disable-next-line prefer-object-spread
    expect(await shellPluginFactory()).toEqual(Object.assign({}, shellPlugin, {scaffold: shell}));
  });
});

import {ungroupObject} from '@form8ion/core';
import {lift as liftJavascript, test as testForJavascript} from '@form8ion/javascript';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {plugins} from './javascript-options.js';
import {javascriptLifterFactory, javascriptTesterFactory} from './enhanced-lifters.js';
import configs from './javascript-configs.js';

vi.mock('@form8ion/core');
vi.mock('./javascript-options.js');
vi.mock('@form8ion/javascript');

describe('enhanced lifters', () => {
  const options = any.simpleObject();
  const dependencies = any.simpleObject();

  it(
    'should pass along the custom properties and injected dependencies with the provided options to the js lifter',
    async () => {
      const results = any.simpleObject();
      const groupedPlugins = any.simpleObject();
      const ungroupedPlugins = any.simpleObject();
      plugins.mockReturnValue(groupedPlugins);
      when(ungroupObject).calledWith(groupedPlugins).thenReturn(ungroupedPlugins);
      when(liftJavascript)
        .calledWith({...options, configs, enhancers: ungroupedPlugins}, dependencies)
        .thenResolve(results);

      expect(await javascriptLifterFactory(dependencies)(options)).toEqual(results);
    }
  );

  it('should pass along injected dependencies with the provided options to the js tester', async () => {
    const determination = any.boolean();
    when(testForJavascript).calledWith(options, dependencies).thenResolve(determination);

    expect(await javascriptTesterFactory(dependencies)(options)).toEqual(determination);
  });
});

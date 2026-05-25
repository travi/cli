import {ungroupObject} from '@form8ion/core';
import * as jsLifter from '@form8ion/javascript';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {plugins} from './javascript-options.js';
import {javascript} from './enhanced-lifters.js';
import configs from './javascript-configs.js';

vi.mock('@form8ion/core');
vi.mock('./javascript-options.js');
vi.mock('@form8ion/javascript');

describe('enhanced lifters', () => {
  it('should pass along the custom properties with the provided options to the js lifter', async () => {
    const options = any.simpleObject();
    const results = any.simpleObject();
    const groupedPlugins = any.simpleObject();
    const ungroupedPlugins = any.simpleObject();
    plugins.mockReturnValue(groupedPlugins);
    when(ungroupObject).calledWith(groupedPlugins).thenReturn(ungroupedPlugins);
    when(jsLifter.lift)
      .calledWith({...options, configs, enhancers: ungroupedPlugins})
      .thenResolve(results);

    expect(await javascript(options)).toEqual(results);
  });
});

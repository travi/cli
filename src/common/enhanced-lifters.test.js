import {ungroupObject} from '@form8ion/core';
import * as jsLifter from '@form8ion/javascript';

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {plugins} from './javascript-options.js';
import {javascript} from './enhanced-lifters.js';
import configs from './javascript-configs.js';

vi.mock('@form8ion/core');
vi.mock('./javascript-options.js');

describe('enhanced lifters', () => {
  beforeEach(() => {
    vi.mock('@form8ion/javascript');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should pass along the custom properties with the provided options to the js lifter', async () => {
    const options = any.simpleObject();
    const results = any.simpleObject();
    const groupedPlugins = any.simpleObject();
    const ungroupedPlugins = any.simpleObject();
    plugins.mockReturnValue(groupedPlugins);
    when(ungroupObject).calledWith(groupedPlugins).mockReturnValue(ungroupedPlugins);
    when(jsLifter.lift)
      .calledWith({...options, configs, enhancers: ungroupedPlugins})
      .mockResolvedValue(results);

    expect(await javascript(options)).toEqual(results);
  });
});

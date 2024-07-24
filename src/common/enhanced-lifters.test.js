import * as jsLifter from '@form8ion/javascript';

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {javascript} from './enhanced-lifters.js';

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
    when(jsLifter.lift).calledWith({...options, configs: {eslint: {scope: '@travi'}}}).mockResolvedValue(results);

    expect(await javascript(options)).toEqual(results);
  });
});

import * as js from '@form8ion/javascript';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {unitTesting} from './enhanced-scaffolders.js';
import {unitTestFrameworks} from '../common/test-frameworks.js';

vi.mock('@form8ion/javascript');

describe('enhanced lift scaffolders', () => {
  it('should provide the frameworks to the unit test framework scaffolder', async () => {
    const results = any.simpleObject();
    const options = any.simpleObject();
    when(js.scaffoldUnitTesting).calledWith({...options, frameworks: unitTestFrameworks}).thenResolve(results);

    expect(await unitTesting(options)).toEqual(results);
  });
});

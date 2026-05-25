import * as mochaPlugin from '@form8ion/mocha-scaffolder';
import * as jestPlugin from '@form8ion/jest-scaffolder';
import * as vitestPlugin from '@form8ion/vitest';
import * as cucumberPlugin from '@form8ion/cucumber-scaffolder';

import {describe, expect, it} from 'vitest';

import {unitTestFrameworks, integrationTestFrameworks} from './test-frameworks.js';

describe('common test frameworks', () => {
  it('should define the unit test frameworks', () => {
    expect(unitTestFrameworks).toEqual({
      vitest: vitestPlugin,
      mocha: mochaPlugin,
      jest: jestPlugin
    });
  });

  it('should define the integration test frameworks', async () => {
    expect(integrationTestFrameworks).toEqual({cucumber: cucumberPlugin});
  });
});

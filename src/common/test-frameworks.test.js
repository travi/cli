import {scaffold as scaffoldMocha} from '@form8ion/mocha-scaffolder';
import {scaffold as scaffoldJest} from '@form8ion/jest-scaffolder';
import {scaffold as scaffoldVitest} from '@form8ion/vitest';

import {describe, expect, it} from 'vitest';

import {unitTestFrameworks} from './test-frameworks';

describe('common test frameworks', () => {
  it('should define the unit test frameworks', () => {
    expect(unitTestFrameworks).toEqual({
      mocha: {scaffolder: scaffoldMocha},
      jest: {scaffolder: scaffoldJest},
      vitest: {scaffolder: scaffoldVitest}
    });
  });
});

import * as mochaPlugin from '@form8ion/mocha-scaffolder';
import * as jestPlugin from '@form8ion/jest-scaffolder';
import * as vitestPlugin from '@form8ion/vitest';

export const unitTestFrameworks = {
  vitest: vitestPlugin,
  mocha: mochaPlugin,
  jest: jestPlugin
};

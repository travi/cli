import {scaffold as scaffoldMocha} from '@form8ion/mocha-scaffolder';
import {scaffold as scaffoldJest} from '@form8ion/jest-scaffolder';

export const unitTestFrameworks = {
  mocha: {scaffolder: scaffoldMocha},
  jest: {scaffolder: scaffoldJest}
};

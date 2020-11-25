import {scaffold as scaffoldMocha} from '@form8ion/mocha-scaffolder';
import {scaffold as scaffoldJest} from '@form8ion/jest-scaffolder';
import {assert} from 'chai';
import {unitTestFrameworks} from './test-frameworks';

suite('common test frameworks', () => {
  test('that the unit test frameworks are defined', () => {
    assert.deepEqual(
      unitTestFrameworks,
      {
        mocha: {scaffolder: scaffoldMocha},
        jest: {scaffolder: scaffoldJest}
      }
    );
  });
});

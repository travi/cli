import {assert} from 'chai';
import {scaffold as scaffoldMocha} from '@form8ion/mocha-scaffolder';
import {scaffold as scaffoldJest} from '@form8ion/jest-scaffolder';
import {unitTestFrameworks} from './options';

suite('common config', () => {
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

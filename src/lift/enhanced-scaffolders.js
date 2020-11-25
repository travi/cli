import {scaffoldUnitTesting} from '@form8ion/javascript-core';
import {unitTestFrameworks} from '../common/options';

export function unitTesting(options) {
  return scaffoldUnitTesting({...options, frameworks: unitTestFrameworks});
}

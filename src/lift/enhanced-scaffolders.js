import {scaffoldUnitTesting} from '@form8ion/javascript-core';
import {unitTestFrameworks} from '../common-config';

export function unitTesting(options) {
  return scaffoldUnitTesting({...options, frameworks: unitTestFrameworks});
}

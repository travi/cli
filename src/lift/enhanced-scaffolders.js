import {scaffoldUnitTesting} from '@form8ion/javascript';
import {unitTestFrameworks} from '../common/test-frameworks';

export function unitTesting(options) {
  return scaffoldUnitTesting({...options, frameworks: unitTestFrameworks});
}

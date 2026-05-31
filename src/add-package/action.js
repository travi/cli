import {scaffold} from '@form8ion/add-package-to-monorepo';
import {logger} from '@form8ion/cli-core';

import {defineScaffoldJavascriptOptions} from '../common/javascript-options.js';

export default function addPackageAction(decisions) {
  return scaffold(defineScaffoldJavascriptOptions(decisions), {logger});
}

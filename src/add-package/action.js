import {scaffold} from '@form8ion/add-package-to-monorepo';
import {logger} from '@form8ion/cli-core';
import {reportResults} from '@form8ion/results-reporter';

import {defineScaffoldJavascriptOptions} from '../common/javascript-options.js';

export default async function addPackageAction(decisions) {
  const results = await scaffold(defineScaffoldJavascriptOptions(decisions), {logger});

  reportResults(results);

  return results;
}

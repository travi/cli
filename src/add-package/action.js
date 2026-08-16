import {scaffold} from '@form8ion/add-package-to-monorepo';
import {getPrompt, logger} from '@form8ion/cli-core';
import {reportResults} from '@form8ion/results-reporter';

import {defineScaffoldJavascriptOptions} from '../common/javascript-options.js';

export default async function addPackageAction(decisions) {
  const results = await scaffold(defineScaffoldJavascriptOptions(), {logger, prompt: getPrompt(decisions)});

  reportResults(results);

  return results;
}

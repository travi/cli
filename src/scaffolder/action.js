import {getPrompt, logger} from '@form8ion/cli-core';
import {reportResults} from '@form8ion/results-reporter';
import {scaffold as scaffoldProject} from '@form8ion/project';

import {defineScaffoldProjectOptions} from '../common/project-options.js';

export default function scaffoldAction(decisions) {
  return async () => {
    const results = await scaffoldProject(
      defineScaffoldProjectOptions(decisions),
      {prompt: getPrompt(decisions), logger}
    );

    reportResults(results);

    return results;
  };
}

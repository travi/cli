import {fileExists} from '@form8ion/core';

import {assert} from 'chai';
import {Then} from '@cucumber/cucumber';

Then('cucumber is configured', async function () {
  assert.isTrue(await fileExists(`${process.cwd()}/test/integration/features/canary.feature`));
  assert.isTrue(await fileExists(`${process.cwd()}/test/integration/features/step_definitions/server-steps.js`));
});

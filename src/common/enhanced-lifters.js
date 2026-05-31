import {ungroupObject} from '@form8ion/core';
import {lift, test} from '@form8ion/javascript';

import {plugins} from './javascript-options.js';

export function javascriptTesterFactory(dependencies) {
  return options => test(options, dependencies);
}

export function javascriptLifterFactory(dependencies) {
  return options => lift({
    ...options,
    configs: {
      eslint: {scope: '@travi'},
      commitlint: {
        name: 'travi',
        packageName: 'commitlint-config-travi'
      },
      babelPreset: {
        name: '@travi',
        packageName: '@travi/babel-preset'
      },
      remark: 'remark-preset-lint-travi'
    },
    enhancers: ungroupObject(plugins())
  }, dependencies);
}

import {ungroupObject} from '@form8ion/core';
import {lift} from '@form8ion/javascript';

import {plugins} from './javascript-options.js';

export function javascript(options) {
  return lift({
    ...options,
    configs: {eslint: {scope: '@travi'}},
    enhancers: ungroupObject(plugins())
  });
}

import {lift} from '@form8ion/javascript';
import {plugins} from './javascript-options.js';

export function javascript(options) {
  return lift({
    ...options,
    configs: {eslint: {scope: '@travi'}},
    enhancers: plugins()
  });
}

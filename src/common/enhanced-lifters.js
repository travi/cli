import {lift} from '@form8ion/javascript';
import * as githubWorkflowsPlugin from '@form8ion/github-actions-node-ci';
import * as rollupPlugin from '@form8ion/rollup';
import * as vitePlugin from '@form8ion/vite';

export function javascript(options) {
  return lift({
    ...options,
    configs: {eslint: {scope: '@travi'}},
    enhancers: {
      'GitHub Actions CI': githubWorkflowsPlugin,
      Rollup: rollupPlugin,
      Vite: vitePlugin
    }
  });
}

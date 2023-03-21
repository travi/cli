/* eslint import/no-extraneous-dependencies: ['error', {'devDependencies': true}] */
import json from 'rollup-plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import executable from 'rollup-plugin-executable';
import autoExternal from 'rollup-plugin-auto-external';

export default {
  input: 'src/index.js',
  plugins: [
    autoExternal(),
    nodeResolve({mainFields: ['module']}),
    json(),
    executable()
  ],
  output: [{file: 'bin/travi.js', format: 'esm', sourcemap: true, banner: '#!/usr/bin/env node'}]
};

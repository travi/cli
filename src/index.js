#!/usr/bin/env node

import program from 'commander';
import {version} from '../package.json';

program
  .version(version)
  .parse(process.argv);

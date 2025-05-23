import {program} from 'commander';
import inquander from 'inquander';
import updateNotifier from 'update-notifier';
import pkg from '../package.json';

import configureProgram from './program.js';

configureProgram(program, pkg);

inquander.parse(program, process.argv);

updateNotifier({pkg}).notify();

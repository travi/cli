import inquander from 'inquander';
import updateNotifier from 'update-notifier';
import pkg from '../package.json';
import configureProgram from './program';

inquander.parse(configureProgram(pkg), process.argv);

updateNotifier({pkg}).notify();

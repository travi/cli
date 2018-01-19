import program from 'commander';
import updateNotifier from 'update-notifier';
import pkg from '../package.json';

program
  .version(pkg.version)
  .parse(process.argv);

updateNotifier({pkg}).notify();

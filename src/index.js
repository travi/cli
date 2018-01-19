import program from 'commander';
import pkg from '../package.json';

program
  .version(pkg.version)
  .parse(process.argv);

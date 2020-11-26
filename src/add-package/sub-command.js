import addPackageAction from './action';

export default function (program) {
  program
    .command('add-package')
    .description('Add a JavaScript package to an existing monorepo')
    .action(addPackageAction);
}

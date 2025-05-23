import addPackageAction from './action.js';

export default function addPackageCommand(program) {
  program
    .command('add-package')
    .description('Add a JavaScript package to an existing monorepo')
    .action(addPackageAction);
}

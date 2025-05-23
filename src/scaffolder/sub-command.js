import getAction from './action.js';

export default function addSubCommand(program) {
  program
    .command('scaffold')
    .description('scaffold a new project')
    .action(getAction());
}

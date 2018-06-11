import action from './action';

export function addSubCommand(program) {
  program
    .command('scaffold')
    .description('scaffold a new project')
    .action(action);
}

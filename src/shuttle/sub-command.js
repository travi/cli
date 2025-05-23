import shuttleAction from './action.js';

export default function shuttleCommand(program) {
  program
    .command('shuttle')
    .description('Shuttle a project to a different organization')
    .action(shuttleAction);
}

import liftAction from './action.js';

export default function liftCommand(program) {
  program
    .command('lift')
    .description('Lift an existing project with additional functionality')
    .action(liftAction);
}

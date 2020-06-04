import liftAction from './action';

export default function (program) {
  program
    .command('lift')
    .description('Lift an existing project with additional functionality')
    .action(liftAction);
}

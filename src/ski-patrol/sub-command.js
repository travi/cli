import liftAction from './action';

export default function (program) {
  program
    .command('ski-patrol')
    .description('Assess an existing project for issues to fix')
    .action(liftAction);
}

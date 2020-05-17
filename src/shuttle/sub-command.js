import shuttleAction from './action';

export default function (program) {
  program
    .command('shuttle')
    .description('Shuttle a project to a different organization')
    .action(shuttleAction);
}

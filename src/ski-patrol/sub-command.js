import skiPatrolAction from './action.js';

export default function skiPatrolCommand(program) {
  program
    .command('ski-patrol')
    .description('Assess an existing project for issues to fix')
    .action(skiPatrolAction);
}

import rollTokenAction from './action';

export default function (program) {
  program
    .command('travis-tokens')
    .description('update a token across projects on Travis-CI')
    .action(rollTokenAction);
}

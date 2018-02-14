import scaffolder from './scaffolder';

export default function (program) {
  program
    .command('scaffold')
    .description('scaffold a new project')
    .action(scaffolder);
}

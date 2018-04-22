import {scaffold} from '@travi/project-scaffolder';

export default function (program) {
  program
    .command('scaffold')
    .description('scaffold a new project')
    .action(() => scaffold().catch(err => {
      console.error(err);     // eslint-disable-line no-console
      process.exitCode = (err.data && err.data.code) || 1;
    }));
}

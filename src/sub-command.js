import {scaffold} from '@travi/project-scaffolder';
import {javascript} from './enhanced-scaffolders';

export function addSubCommand(program) {
  program
    .command('scaffold')
    .description('scaffold a new project')
    .action(() => scaffold({languages: {JavaScript: javascript}}).catch(err => {
      console.error(err);     // eslint-disable-line no-console
      process.exitCode = (err.data && err.data.code) || 1;
    }));
}

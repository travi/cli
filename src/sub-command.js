import {scaffold} from '@travi/project-scaffolder';
import {scaffold as scaffoldJavascript} from '@travi/javascript-scaffolder';

export function addSubCommand(program) {
  program
    .command('scaffold')
    .description('scaffold a new project')
    .action(() => scaffold({languages: {JavaScript: scaffoldJavascript}}).catch(err => {
      console.error(err);     // eslint-disable-line no-console
      process.exitCode = (err.data && err.data.code) || 1;
    }));
}

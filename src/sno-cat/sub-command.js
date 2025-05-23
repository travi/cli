import snoCatAction from './action.js';

export default function snoCatSubCommand(program) {
  program
    .command('sno-cat')
    .description('Groom the GitHub notification list')
    .action(snoCatAction);
}

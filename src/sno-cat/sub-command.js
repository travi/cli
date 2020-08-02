import snoCatAction from './action';

export default function (program) {
  program
    .command('sno-cat')
    .description('Groom the GitHub notification list')
    .action(snoCatAction);
}

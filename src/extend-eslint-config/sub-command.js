import extendAction from './action';

export default function (program) {
  program
    .command('extend-eslint-config')
    .description('Extend a @form8ion shareable ESLint config')
    .action(extendAction);
}

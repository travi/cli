import extendAction from './action.js';

export default function extendEslintConfigCommand(program) {
  program
    .command('extend-eslint-config')
    .description('Extend a @form8ion shareable ESLint config')
    .action(extendAction);
}

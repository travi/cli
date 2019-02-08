import {addSubCommand} from '@travi/scaffolder-sub-command';
import travisTokensSubCommand from './travis-tokens';

export default function (program, {version}) {
  program.version(version);

  addSubCommand(program);

  travisTokensSubCommand(program);
}

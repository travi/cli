import {addSubCommand} from '@travi/scaffolder-sub-command';
import travisTokensSubCommand from './travis-tokens';
import liftCommand from './lift';
import skiPatrolCommand from './ski-patrol';

export default function (program, {version}) {
  program.version(version);

  addSubCommand(program);
  travisTokensSubCommand(program);
  liftCommand(program);
  skiPatrolCommand(program);
}

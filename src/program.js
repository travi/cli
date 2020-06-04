import {addSubCommand} from './scaffolder';
import travisTokensSubCommand from './travis-tokens';
import liftCommand from './lift';
import skiPatrolCommand from './ski-patrol';
import shuttleCommand from './shuttle';

export default function (program, {version}) {
  program.version(version);

  addSubCommand(program);
  travisTokensSubCommand(program);
  liftCommand(program);
  skiPatrolCommand(program);
  shuttleCommand(program);
}
